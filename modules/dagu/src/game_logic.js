let game_logic = {
    init: function(){
        game.settings = {
            zoom_factor: 13,
        };
        game.chunks = [];
        game.character = {
            x: 0,
            y: 0,
            home_x:0,
            home_y:0,
            level: 1,
            experience: 0,
            unspent_skill_points: 1,
            current_health: BASE_HEALTH,
            max_health: 0,
            health_regeneration: 1,
            current_mana: BASE_MANA,
            max_mana: 0,
            mana_regeneration: 1,
            cooldown_reduction: 0,
            armor: 0,
            magic_resistance: 0,
            attack_power: 5,
            attack_lifesteal: 0,
            magic_power: 5,
            magic_lifesteal: 0,
            equipped_items: {
                helmet: null,
                shoulders: null,
                gauntlets: null,
                chest: null,
                belt: null,
                pants: null,
                boots: null,
                main_hand: null,
                off_hand: null,
                necklace: null,
                ring1: null,
                ring2: null,
            },
            inventory: {
                gold: 500,
                items: [],
            },
            quests: [],
            quest_data: {},
            completed_quests: [],
            completed_dungeons: [],
            upgrades: [],
            attacks: [
                'Basic Attack',
            ],
            cooldowns: {
                'Basic Attack': 0,
            },
            hotbar: [
                "",
                "Basic Attack",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
            ],

        };
        game.status = STATUS.COMBAT;
        game_logic.generateChunk(0, 0);
        if(map.get(CHUNK_SIZE,0).type === undefined){
            game_logic.generateChunk(1, 0);
        }
        if(map.get(CHUNK_SIZE,CHUNK_SIZE).type === undefined){
            game_logic.generateChunk(1, 1);
        }
        if(map.get(0,CHUNK_SIZE).type === undefined){
            game_logic.generateChunk(0, 1);
        }
        if(map.get(CHUNK_SIZE*-1,CHUNK_SIZE).type === undefined){
            game_logic.generateChunk(-1, 1);
        }
        if(map.get(CHUNK_SIZE*-1,0).type === undefined){
            game_logic.generateChunk(-1, 0);
        }
        if(map.get(CHUNK_SIZE*-1,CHUNK_SIZE*-1).type === undefined){
            game_logic.generateChunk(-1, -1);
        }
        if(map.get(0,CHUNK_SIZE*-1).type === undefined){
            game_logic.generateChunk(0, -1);
        }
        if(map.get(CHUNK_SIZE,CHUNK_SIZE*-1).type === undefined){
            game_logic.generateChunk(1, -1);
        }
    },
    generateChunk: function(chunk_x, chunk_y){
        let r = util.getRandomInt(100);
        map.get(chunk_x*CHUNK_SIZE,chunk_y*CHUNK_SIZE);
        let monsters;
        let points;
        let point;
        let i;
        let j;
        if((chunk_x === 0 && chunk_y === 0) ||
            (chunk_x === 1 && chunk_y === 0) ||
            (chunk_x === 1 && chunk_y === 1) ||
            (chunk_x === 0 && chunk_y === 1) ||
            (chunk_x === -1 && chunk_y === 1) ||
            (chunk_x === -1 && chunk_y === 0) ||
            (chunk_x === -1 && chunk_y === -1) ||
            (chunk_x === 0 && chunk_y === -1) ||
            (chunk_x === 1 && chunk_y === -1)){
            r = util.getRandomInt(90);
        }

        if(r < 75){
            //generate wilderness
            map.getChunk(chunk_x,chunk_y).name = "Wilderness";
            map.getChunk(chunk_x,chunk_y).type = "wilderness";

            for(i = CHUNK_SIZE * chunk_x; i < CHUNK_SIZE + (CHUNK_SIZE * chunk_x); i++){
                for(j = CHUNK_SIZE * chunk_y; j < CHUNK_SIZE + (CHUNK_SIZE * chunk_y); j++){
                    //console.log("generating point " + i + "," + j);
                    if(util.getRandomInt(100) < 10){
                        map.get(i, j).type = 'tree';
                    }else{
                        if(util.getRandomInt(100) < 30){
                            map.get(i, j).type = 'dirt';
                        }else{
                            map.get(i, j).type = 'grass';
                        }
                    }
                    map.get(i, j).direction = util.getRandomInt(4);
                }
            }

            let quest_monsters = quests.requestMonsters();
            if(quest_monsters.length === 0){
                monsters = game_logic.generateChunkEnemies();
            }else{
                monsters = game_logic.generateChunkEnemies(quest_monsters);
            }
            if((chunk_x === 0 && chunk_y === 0) ||
                (chunk_x === 1 && chunk_y === 0) ||
                (chunk_x === 1 && chunk_y === 1) ||
                (chunk_x === 0 && chunk_y === 1) ||
                (chunk_x === -1 && chunk_y === 1) ||
                (chunk_x === -1 && chunk_y === 0) ||
                (chunk_x === -1 && chunk_y === -1) ||
                (chunk_x === 0 && chunk_y === -1) ||
                (chunk_x === 1 && chunk_y === -1)){
                monsters = [];
            }
            map.get(0, 0).type = 'grass';
            pathfinder.resetPFVariable();
            for(i = 0; i < monsters.length; i++){
                let c = 0;
                while(c<10){
                    let tx = util.getRandomInt(CHUNK_SIZE) + (CHUNK_SIZE * chunk_x);
                    let ty = util.getRandomInt(CHUNK_SIZE) + (CHUNK_SIZE * chunk_y);
                    if(util.isWalkable(tx,ty) && util.isPathable(tx,ty)){
                        map.get(tx, ty).npc = monsters[i];
                        c=11;
                    }else{
                        c++;
                    }
                }
            }
        }else if(r >= 75 && r < 90){
            //generate town
            let town = util.getRandomItemInArray(TOWNS);
            map.getChunk(chunk_x,chunk_y).name = util.getRandomItemInArray(TOWN_NAMES);
            map.getChunk(chunk_x,chunk_y).type = 'town';
            map.getChunk(chunk_x,chunk_y).description = town.description;

            let town_i = CHUNK_SIZE - 1;
            let town_j = 0;
            for(i = CHUNK_SIZE * chunk_x; i < CHUNK_SIZE + (CHUNK_SIZE * chunk_x); i++){
                for(j = CHUNK_SIZE * chunk_y; j < CHUNK_SIZE + (CHUNK_SIZE * chunk_y); j++){
                    map.get(i, j).type = town.tiles[town_i][town_j].type;
                    if(town.tiles[town_i][town_j].direction != null){
                        map.get(i, j).direction = town.tiles[town_i][town_j].direction;
                    }else{
                        map.get(i, j).direction = util.getRandomInt(4);
                    }
                    if(town.tiles[town_i][town_j].npc && util.getRandomInt(100) < TOWN_NPC_CHANCE){
                        let npc_list = quests.requestNPCs();
                        if(npc_list.length === 0 || util.getRandomInt(100) < 50){
                            map.get(i, j).npc = game_logic.generateShop();
                        }else{
                            map.get(i, j).npc = util.getRandomItemInArray(npc_list);
                        }
                    }
                    town_j++;
                }
                town_j = 0;
                town_i--;
            }
            map.get(0, 0).type = 'grass';
            pathfinder.resetPFVariable();
        }else if(r >= 90){
            //generate dungeon
            let dungeons = quests.requestDungeons();
            let dungeon;
            if(dungeons.length === 0){
                dungeon = util.getRandomItemInArray(DUNGEONS);
            }else{
                dungeon = DUNGEONS[util.getRandomItemInArray(dungeons)];
            }
            map.getChunk(chunk_x,chunk_y).name = dungeon.name;
            map.getChunk(chunk_x,chunk_y).type = "dungeon";
            map.getChunk(chunk_x,chunk_y).description = dungeon.description;

            let dungeon_i = CHUNK_SIZE - 1;
            let dungeon_j = 0;
            for(i = CHUNK_SIZE * chunk_x; i < CHUNK_SIZE + (CHUNK_SIZE * chunk_x); i++){
                for(j = CHUNK_SIZE * chunk_y; j < CHUNK_SIZE + (CHUNK_SIZE * chunk_y); j++){
                    map.get(i, j).type = dungeon.tiles[dungeon_i][dungeon_j].type;
                    if(dungeon.tiles[dungeon_i][dungeon_j].direction != null){
                        map.get(i, j).direction = dungeon.tiles[dungeon_i][dungeon_j].direction;
                    }else{
                        map.get(i, j).direction = util.getRandomInt(4);
                    }
                    dungeon_j++;
                }
                dungeon_j = 0;
                dungeon_i--;
            }
            if((chunk_x === 0 && chunk_y === 0) ||
                (chunk_x === 1 && chunk_y === 0) ||
                (chunk_x === 1 && chunk_y === 1) ||
                (chunk_x === 0 && chunk_y === 1) ||
                (chunk_x === -1 && chunk_y === 1) ||
                (chunk_x === -1 && chunk_y === 0) ||
                (chunk_x === -1 && chunk_y === -1) ||
                (chunk_x === 0 && chunk_y === -1) ||
                (chunk_x === 1 && chunk_y === -1)){
                monsters = [];
            }
            map.get(0, 0).type = 'grass';
            pathfinder.resetPFVariable();

            monsters = game_logic.generateChunkEnemies(dungeon.monsters, dungeon.boss_monsters);
            for(i = 0; i < monsters.length; i++){
                let c = 0;
                while(c<10){
                    let tx = util.getRandomInt(CHUNK_SIZE) + (CHUNK_SIZE * chunk_x);
                    let ty = util.getRandomInt(CHUNK_SIZE) + (CHUNK_SIZE * chunk_y);
                    if(util.isWalkable(tx,ty) && util.isPathable(tx,ty)){
                        map.get(tx, ty).npc = monsters[i];
                        c=11;
                    }else{
                        c++;
                    }
                }
            }
        }

        quests.logChunkExplore(chunk_x, chunk_y);
    },

    generateChunkEnemies: function(monster_list, boss_monsters){
        let ans = [];
        if(monster_list == null || monster_list.length === 0){
            let r = util.getRandomInt(MONSTERS_PER_CHUNK) + 1;
            for(let i = 0; i < r; i++){
                let generic_monster_data = monsters.getRandomMonster();
                let stats = game_logic.generateMonsterStatBlock(game.character.level * MONSTER_DIFFICULTY_MULTIPLIER, generic_monster_data.preferred_stats);
                let monster = {
                    name: generic_monster_data.name,
                    description: generic_monster_data.description,
                    type: "monster",
                    icon: generic_monster_data.icon,
                    level: game.character.level,
                    max_health: stats.max_health + MONSTER_BASE_HEALTH,
                    health_regeneration:stats.health_regeneration,
                    armor: stats.armor,
                    magic_resistance: stats.magic_resistance,
                    attack_power: stats.attack_power + MONSTER_BASE_ATTACK_POWER,
                    attack_lifesteal: stats.attack_lifesteal,
                    magic_power: stats.magic_power + MONSTER_BASE_MAGIC_POWER,
                    magic_lifesteal: stats.magic_lifesteal,
                    loot: game_logic.generateLoot(),
                    attacks: generic_monster_data.attacks,
                    cooldowns: {},

                };
                monster.current_health = monster.max_health;

                for(let i = 0; i < monster.attacks.length; i++){
                    monster.cooldowns[monster.attacks[i]] = 0;
                }

                ans.push(monster);
            }
        }else{
            let r = util.getRandomInt(MONSTERS_PER_CHUNK) + 1;
            for(let i = 0; i < r; i++){
                let generic_monster_data = monsters.getMonster(util.getRandomItemInArray(monster_list));
                let stats = game_logic.generateMonsterStatBlock(game.character.level * MONSTER_DIFFICULTY_MULTIPLIER, generic_monster_data.preferred_stats);
                let monster = {
                    name: generic_monster_data.name,
                    description: generic_monster_data.description,
                    type: "monster",
                    icon: generic_monster_data.icon,
                    level: game.character.level,
                    max_health: stats.max_health + MONSTER_BASE_HEALTH,
                    health_regeneration:stats.health_regeneration,
                    armor: stats.armor,
                    magic_resistance: stats.magic_resistance,
                    attack_power: stats.attack_power + MONSTER_BASE_ATTACK_POWER,
                    attack_lifesteal: stats.attack_lifesteal,
                    magic_power: stats.magic_power + MONSTER_BASE_MAGIC_POWER,
                    magic_lifesteal: stats.magic_lifesteal,
                    loot: game_logic.generateLoot(),
                    attacks: generic_monster_data.attacks,
                    cooldowns: {},

                };
                monster.current_health = monster.max_health;

                for(let i = 0; i < monster.attacks.length; i++){
                    monster.cooldowns[monster.attacks[i]] = 0;
                }

                ans.push(monster);
            }
        }

        if(boss_monsters != null && boss_monsters.length > 0){
            for(let i = 0; i < boss_monsters.length; i++){
                let generic_monster_data = monsters.getMonster(boss_monsters[i]);
                let stats = game_logic.generateMonsterStatBlock(game.character.level * MONSTER_DIFFICULTY_MULTIPLIER, generic_monster_data.preferred_stats);
                let monster = {
                    name: generic_monster_data.name,
                    description: generic_monster_data.description,
                    type: "monster",
                    icon: generic_monster_data.icon,
                    level: game.character.level,
                    max_health: stats.max_health + MONSTER_BASE_HEALTH,
                    health_regeneration:stats.health_regeneration,
                    armor: stats.armor,
                    magic_resistance: stats.magic_resistance,
                    attack_power: stats.attack_power + MONSTER_BASE_ATTACK_POWER,
                    attack_lifesteal: stats.attack_lifesteal,
                    magic_power: stats.magic_power + MONSTER_BASE_MAGIC_POWER,
                    magic_lifesteal: stats.magic_lifesteal,
                    loot: game_logic.generateLoot(),
                    attacks: generic_monster_data.attacks,
                    cooldowns: {},

                };
                monster.current_health = monster.max_health;

                for(let i = 0; i < monster.attacks.length; i++){
                    monster.cooldowns[monster.attacks[i]] = 0;
                }

                ans.push(monster);
            }
        }
        return ans;
    },

    tick: function(){
        if(!util.isInTown()){
            let monsters = util.getAllMonsters();
            for(let i = 0; i < monsters.length; i++){
                if(util.distanceBetween(game.character.x,game.character.y,monsters[i].x,monsters[i].y) <= TICK_THRESHOLD){
                    //console.log('doing turn for ' + monsters[i].x + "," + monsters[i].y);
                    monster_attack.handleMonsterTurn(monsters[i].x,monsters[i].y);
                }
            }
        }

        for(let i = 0; i < game.character.attacks.length; i++){
            if(game.character.cooldowns[game.character.attacks[i]] == null){
                game.character.cooldowns[game.character.attacks[i]] = 0;
            }
            if(game.character.cooldowns[game.character.attacks[i]] > 0){
                game.character.cooldowns[game.character.attacks[i]] -= 1;
                if(game.character.cooldowns[game.character.attacks[i]] > 0 && util.getRandomInt(100) < util.normalizeStat(util.characterStats.cooldown_reduction())){
                        game.character.cooldowns[game.character.attacks[i]] -= 1;
                }
            }
        }

        util.healCharacter(util.characterStats.health_regeneration());

        util.giveCharacterMana(util.characterStats.mana_regeneration());

        quests.logTick();
    },

    generateEquipment: function(){
        let item = {
            name: null,
            type: ITEM_TYPES.EQUIPMENT,
            icon: null,
            slot: util.getRandomItemInArray(ITEM_SLOTS),
            stats: game_logic.generateItemStatBlock(6 + game.character.level),
            level: game.character.level,
            description: util.getRandomItemInArray(ITEM_DESCRIPTIONS),
            value: util.getRandomInt(100) + 1,
        };
        item.name = util.getRandomItemInArray(ITEM_NAMES[item.slot]);
        item.icon = util.getRandomItemInArray(ICONS.EQUIPMENT[item.slot]);
        return item;
    },

    generateItem: function(){
        let r = util.getRandomInt(100);
        let item = {};
        if(r < CONSUMABLE_CHANCE){
            item = util.getRandomItemInArray(consumables.consumable_list);
            item.type = ITEM_TYPES.CONSUMABLE;
        }else{
            item = game_logic.generateEquipment();
        }
        return item;
    },

    generateLoot: function(n){
        if(n == null){
            n = util.getRandomInt(10);
        }
        let items = [];
        for(let i = -1; i < n; i++){
            items.push(game_logic.generateItem());
        }
        return items;
    },

    generateShop: function(){
        let npc = game_logic.generateBaseNPC();
        return {
            name: npc.name,
            icon: npc.icon,
            description: npc.description,
            type: "shop",
            items: game_logic.generateLoot(),
        };
    },

    giveEXP: function(experience){
        game.output.push('You Gained ' + experience + ' EXP');
        game.character.experience += experience;
        if(game.character.experience >= util.getExperienceNeededForLevel(game.character.level+1)){
            game_logic.levelUp();
        }
    },

    levelUp: function(){
        game.character.unspent_skill_points += 1;
        game.character.level += 1;
        game.character.experience -= util.getExperienceNeededForLevel(game.character.level);
        game.output.push('You Leveled Up! You are now Level ' + game.character.level + ' and have ' + game.character.unspent_skill_points + ' unspent skill points.');
    },

    generateItemStatBlock: function(points, preferred_stats){
        if(preferred_stats == null){
            preferred_stats = [];
        }
        let rarity = preferred_stats.length + util.getRandomInt(6 - preferred_stats.length);

        let stats = [
            "max_health",
            "health_regeneration",
            "max_mana",
            "mana_regeneration",
            "cooldown_reduction",
            "attack_power",
            "attack_lifesteal",
            "armor",
            "magic_power",
            "magic_lifesteal",
            "magic_resistance",
        ];

        stats = util.shuffle(stats);

        let ans = {
            "max_health":0,
            "health_regeneration":0,
            "max_mana":0,
            "mana_regeneration":0,
            "cooldown_reduction":0,
            "attack_power":0,
            "attack_lifesteal":0,
            "armor":0,
            "magic_power":0,
            "magic_lifesteal":0,
            "magic_resistance":0,
        };
        for(let i = 0; i < preferred_stats.length; i++){
            let points_to_remove = Math.floor(((util.getRandomInt(50)+25)/100.0)*points);
            points -= points_to_remove;
            ans[preferred_stats[i]] += points_to_remove;
            if(points <= 0){
                i = preferred_stats.length;
                break;
            }
        }
        for(let i = 0; i <= rarity - preferred_stats.length; i++){
            let points_to_remove = Math.floor(((util.getRandomInt(50)+25)/100.0)*points);
            points -= points_to_remove;
            let stat = stats.shift();
            ans[stat] += points_to_remove;
            if(points <= 0){
                i = rarity - preferred_stats.length + 1;
                break;
            }
        }

        if(rarity === 0){
            ans.rarity = 'Common';
        }else if(rarity === 1){
            ans.rarity = 'Uncommon';
        }else if(rarity === 2){
            ans.rarity = 'Rare';
        }else if(rarity === 3){
            ans.rarity = 'Epic';
        }else if(rarity === 4){
            ans.rarity = 'Legendary';
        }else if(rarity === 5){
            ans.rarity = 'Mythic';
        }else{
            ans.rarity = 'other';
        }

        return ans;
    },

    generateMonsterStatBlock: function(points, preferred_stats){
        let stats = [
            "max_health",
            "health_regeneration",
            "max_mana",
            "mana_regeneration",
            "cooldown_reduction",
            "attack_power",
            "attack_lifesteal",
            "armor",
            "magic_power",
            "magic_lifesteal",
            "magic_resistance",
        ];

        stats = util.shuffle(stats);

        let ans = {
            "max_health":0,
            "health_regeneration":0,
            "max_mana":0,
            "mana_regeneration":0,
            "cooldown_reduction":0,
            "attack_power":0,
            "attack_lifesteal":0,
            "armor":0,
            "magic_power":0,
            "magic_lifesteal":0,
            "magic_resistance":0,
        };
        for(let i = 0; i < preferred_stats.length; i++){
            let points_to_remove = Math.floor(((util.getRandomInt(50)+25)/100.0)*points);
            points -= points_to_remove;
            ans[preferred_stats[i]] += points_to_remove;
            if(points <= 0){
                i = preferred_stats.length + 1;
                break;
            }
        }
        while(stats.length > 0 && points > 0){
            let points_to_remove = Math.floor(((util.getRandomInt(50)+25)/100.0)*points);
            points -= points_to_remove;
            let stat = stats.shift();
            ans[stat] += points_to_remove;
        }


        return ans;
    },

    generateBaseNPC: function(){
        return {
            name: util.getRandomName(),
            icon: util.getRandomItemInArray(ICONS.NPCS),
            description: util.getRandomItemInArray(NPC_RACES) + " " + util.getRandomItemInArray(NPC_PROFESSIONS) + " - " + util.getRandomItemInArray(NPC_DESCRIPTIONS),
        };
    },
};