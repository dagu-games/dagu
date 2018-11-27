let game_logic = {
    init: function(){
        game.settings = {
            zoom_factor: 11,
        };
        game.chunks = [];
        game.character = {
            x: 0,
            y: 0,
            level: 1,
            experience: 0,
            unspent_skill_points: 1,
            current_health: 100,
            max_health: 100,
            health_regeneration: 1,
            current_mana: 100,
            max_mana: 100,
            mana_regeneration: 1,
            cooldown_reduction: 0,
            armor: 0,
            magic_resistance: 0,
            attack_power: 1,
            attack_lifesteal: 0,
            magic_power: 0,
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
                gold: 0,
                equipment: [],
                quest_items: [],
            },
            quests: [],
            completed_quests: [],
            upgrades: [],
            attacks: [
                'Basic Attack',
            ],
            cooldowns: {
                'Basic Attack': 0,
            },

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
        let r = util.randomInt(100);
        map.get(chunk_x*CHUNK_SIZE,chunk_y*CHUNK_SIZE);
        let monsters;
        let points;
        let point;
        let i;
        let j;
        if(r < 75){   //generate wilderness
            map.getChunk(chunk_x,chunk_y).name = "Wilderness";
            monsters = game_logic.generateChunkEnemies();

            for(i = CHUNK_SIZE * chunk_x; i < CHUNK_SIZE + (CHUNK_SIZE * chunk_x); i++){
                for(j = CHUNK_SIZE * chunk_y; j < CHUNK_SIZE + (CHUNK_SIZE * chunk_y); j++){
                    //console.log("generating point " + i + "," + j);
                    if(util.randomInt(100) < 10){
                        map.get(i, j).type = 'tree';
                    }else{
                        if(util.randomInt(100) < 30){
                            map.get(i, j).type = 'dirt';
                        }else{
                            map.get(i, j).type = 'grass';
                        }
                    }
                }
            }

            map.get(0, 0).type = 'grass';
            pathfinder.resetPFVariable();
            for(i = 0; i < monsters.length; i++){
                let c = 0;
                while(c<10){
                    let tx = util.randomInt(CHUNK_SIZE) + (CHUNK_SIZE * chunk_x);
                    let ty = util.randomInt(CHUNK_SIZE) + (CHUNK_SIZE * chunk_y);
                    if(util.isWalkable(tx,ty) && util.isPathable(tx,ty)){
                        map.get(tx, ty).npc = monsters[i];
                        c=11;
                    }else{
                        c++;
                    }
                }
            }
        }else if(r >= 75 && r < 85){    //generate dungeon
            map.getChunk(chunk_x,chunk_y).name = "Dungeon";
            monsters = game_logic.generateChunkEnemies();

            for(i = CHUNK_SIZE * chunk_x; i < CHUNK_SIZE + (CHUNK_SIZE * chunk_x); i++){
                for(j = CHUNK_SIZE * chunk_y; j < CHUNK_SIZE + (CHUNK_SIZE * chunk_y); j++){
                    map.get(i, j).type = 'stone';
                }
            }

            map.get(0, 0).type = 'grass';
            pathfinder.resetPFVariable();
            for(i = 0; i < monsters.length; i++){
                let c = 0;
                while(c<10){
                    let tx = util.randomInt(CHUNK_SIZE) + (CHUNK_SIZE * chunk_x);
                    let ty = util.randomInt(CHUNK_SIZE) + (CHUNK_SIZE * chunk_y);
                    if(util.isWalkable(tx,ty) && util.isPathable(tx,ty)){
                        map.get(tx, ty).npc = monsters[i];
                        c=11;
                    }else{
                        c++;
                    }
                }
            }
        }else if(r >= 85){    //generate town
            map.getChunk(chunk_x,chunk_y).name = util.randomItemInArray(TOWN_NAMES);
            for(i = CHUNK_SIZE * chunk_x; i < CHUNK_SIZE + (CHUNK_SIZE * chunk_x); i++){
                for(j = CHUNK_SIZE * chunk_y; j < CHUNK_SIZE + (CHUNK_SIZE * chunk_y); j++){
                    map.get(i, j).type = 'grass';
                    if(util.randomInt(100) < 8){
                        map.get(i, j).npc = game_logic.generateNPC();
                    }
                }
            }
            map.get(0, 0).type = 'grass';
            pathfinder.resetPFVariable();
        }
    },

    generateChunkEnemies: function(){
        let ans = [];
        let r = util.randomInt(10) + 1;
        for(let i = 0; i < r; i++){
            let monster = {
                name: "HellHound",
                type: "monster",
                max_health: 100,
                current_health: 100,
                armor: 10,
                magic_resistance: 10,
                attack_power: 10,
                attack_lifesteal: 10,
                magic_power: 10,
                magic_lifesteal: 10,
                loot: game_logic.generateLoot(),
                monster_attacks: [
                    "bite",
                    "scratch",
                ],
            };
            if(game.character.quests.length > 0 && util.randomInt(2) < 1){
                monster.goal_item = util.getQuest(util.randomItemInArray(game.character.quests)).goal_item;
                //console.log(util.randomItemInArray(game.character.quests));
                //console.log(game.character.quests);
            }else{
                monster.goal_item = null;
            }
            ans.push(monster);
        }
        return ans;
    },

    tick: function(x, y){
        let monsters = util.getAllMonsters();
        for(let i = 0; i < monsters.length; i++){

        }
    },

    generateLoot: function(){
        let n = util.randomInt(10);
        let items = [];
        for(let i = -1; i < n; i++){
            let item = {
                name: null,
                slot: util.randomItemInArray(ITEM_SLOTS),
                stats: {
                    max_health: 10,
                    armor: 10,
                    magic_resistance: 10,
                    attack_power: 10,
                    attack_lifesteal: 10,
                    magic_power: 10,
                    magic_lifesteal: 10,
                    cooldown_reduction: 10,
                    mana_regeneration: 2,
                    max_mana: 10,
                },
                description: util.randomItemInArray(ITEM_DESCRIPTIONS),
                value: util.randomInt(100),
            };
            item.name = util.randomItemInArray(ITEM_NAMES[item.slot]);

            items.push(item);
        }
        return items;
    },

    generateNPC: function(){
        let npc = {
            name: util.randomItemInArray(NPC_FIRST_NAMES) + " " + util.randomItemInArray(NPC_LAST_NAMES),
            description: util.randomItemInArray(RACES) + " " + util.randomItemInArray(PROFESSIONS) + " - " + util.randomItemInArray(NPC_DESCRIPTIONS),
        };

        if(util.randomInt(2) === 0){
            npc.type = "shop";
            npc.items = game_logic.generateLoot();
        }else{
            npc.type = "quest_giver";
            npc.quest = util.getRandomAvailableQuestName();
        }
        return npc;
    },
};