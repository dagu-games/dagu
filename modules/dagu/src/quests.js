let quests = {
    getQuest: function(quest_name){
        for(let i = 0; i < quests.quest_list.length; i++){
            if(quest_name === quests.quest_list[i].name){
                return quests.quest_list[i];
            }
        }
        return null;
    },

    getAvailableQuests: function(){
        let ans = [];
        for(let i = 0; i < quests.quest_list.length; i++){
            if(!quests.isQuestCompleted(quests.quest_list[i].name) && quests.quest_list[i].isAvailable()){
                ans.push(quests.quest_list[i]);
            }
        }
        return ans;
    },

    isQuestCompleted: function(quest_name){
        for(let i = 0; i < game.character.completed_quests.length; i++){
            if(quest_name === game.character.completed_quests[i]){
                return true;
            }
        }
        return false;
    },

    hasQuest: function(quest_name){
        for(let i = 0; i < game.character.quests.length; i++){
            if(game.character.quests[i] === quest_name){
                return true;
            }
        }
        return false;
    },

    getRandomAvailableQuestName: function(){
        let quests = util.getAvailableQuests();
        if(quests.length > 0){
            return util.getRandomItemInArray(quests).name;
        }else{
            return null;
        }
    },

    logMonsterKill: function(monster_name){
        for(let i = 0; i < game.character.quests.length; i++){
            quests.getQuest(game.character.quests[i]).onMonsterKill(monster_name);
        }
    },

    logChunkExplore: function(chunk_x, chunk_y){
        for(let i = 0; i < game.character.quests.length; i++){
            quests.getQuest(game.character.quests[i]).onChunkExplore(chunk_x, chunk_y);
        }
    },

    logTick: function(){
        for(let i = 0; i < game.character.quests.length; i++){
            quests.getQuest(game.character.quests[i]).onTick();
        }
    },

    countGoalItems: function(goal_item_name){
        let count = 0;
        for(let i = 0; i < game.character.inventory.items.length; i++){
            if(game.character.inventory.items[i].name === goal_item_name){
                count++;
            }
        }
        return count;
    },

    removeGoalItems: function(goal_item_name){
        for(let i = 0; i < game.character.inventory.items.length; i++){
            if(game.character.inventory.items[i].name === goal_item_name){
                game.character.inventory.items.splice(i,1);
                i--;
            }
        }
    },

    requestMonsters: function(){
        let monsters = [];
        for(let i = 0; i < game.character.quests.length; i++){
            let quest = quests.getQuest(game.character.quests[i]);
            if(quest.monsters != null && quest.monsters.length > 0){
                monsters = monsters.concat(quest.monsters);
            }
        }
        return monsters;
    },

    requestDungeons: function(){
        let dungeons = [];
        for(let i = 0; i < game.character.quests.length; i++){
            let quest = quests.getQuest(game.character.quests[i]);
            if(quest.dungeons != null && quest.dungeons.length > 0){
                dungeons = dungeons.concat(quest.dungeons);
            }
        }
        return dungeons;
    },

    requestNPCs: function(){
        let NPCs = [];
        let quest_list = quests.getAvailableQuests();
        for(let i = 0; i < quest_list.length; i++){
            NPCs.push(quest_list[i].generateNPC());
        }
        return NPCs;
    },

    quest_list: [
        {
            name: "Find my dog!",
            description: "I lost my dog! can you help me find it? Some monsters took him from me!",
            monsters: ["Hellhound"],
            dungeons: [],
            isAvailable: function(){
                return true;
            },
            meetsRequirements: function(){
                return (quests.countGoalItems("Lost Dog") > 0);
            },
            findDirection: function(){
                let monster_point = util.getNearestMonsterByNames("Hellhound");
                if(monster_point == null){
                    return '?';
                }else{
                    return util.findDirection(game.character.x,game.character.y,monster_point.x,monster_point.y);
                }
            },
            onAccept: function(){},
            onAbandon: function(){
                quests.removeGoalItems("Lost Dog");
            },
            onMonsterKill: function(monster_name){
                if(quests.countGoalItems("Lost Dog") < 1 && util.isInArray(["Hellhound"],monster_name)){
                    game.character.inventory.items.push({
                        name: "Lost Dog",
                        description: "You found the lost dog! Take him back to his owner and they will reward you!",
                        icon: INTERFACE_ICONS.GOAL_ITEMS.LOST_DOG,
                        type: ITEM_TYPES.GOAL_ITEM,
                    });
                }
            },
            onChunkExplore: function(chunk_x,chunk_y){},
            onTick: function(){},
            onComplete: function(){
                game_logic.giveEXP(1000);
                game.output.push("Thank you for finding me dog! I was worried sick!");
                quests.removeGoalItems("Lost Dog");
                return true;
            },
            generateNPC: function(){
                let npc = game_logic.generateBaseNPC();
                return {
                    name: npc.name,
                    type: "quest_giver",
                    icon: npc.icon,
                    description: npc.description,
                    quest: "Find my dog!",
                };
            },
        },
        /*
        {
            name: "Kill a hellhound",
            type: QUEST_TYPES.KILL,
            count: 1,
            description: "Kill a single hellhound.",
            goal_monsters: ["Hellhound"],
            completion_message: "Thank you for killing the hellhound!",
            isAvailable: function(){
                return true;
            },
            meetsRequirements: function(){
                return (quests.countGoalItems("Lost Dog") > 0);
            },
            findDirection: function(){
                let monster_point = utilities.getNearestMonsterByNames("Hellhound");
                if(monster_point == null){
                    return '?';
                }else{
                    return utilities.findDirection(game.character.x,game.character.y,monster_point.x,monster_point.y);
                }
            },
            onAccept: function(){},
            onAbandon: function(){
                quests.removeGoalItems("Lost Dog");
            },
            onMonsterKill: function(monster_name){
                if(quests.countGoalItems("Lost Dog") < 1 && utilities.isInArray(["Hellhound"],monster_name)){
                    game.character.inventory.push({
                        name: "Lost Dog",
                        description: "You found the lost dog! Take him back to his owner and they will reward you!",
                        icon: INTERFACE_ICONS.GOAL_ITEMS.LOST_DOG,
                        type: ITEM_TYPES.GOAL_ITEM,
                    });
                }
            },
            onChunkExplore: function(chunk_x,chunk_y){},
            onComplete: function(){
                game_logic.giveEXP(1000);
                game.output.push("Thank you for finding me dog! I was worried sick!");
                quests.removeGoalItems("Lost Dog");
                return true;
            },
            generateNPC: function(){
                return {
                    name: utilities.getRandomName(),
                    type: "quest_giver",
                    icon: utilities.getRandomItemInArray(INTERFACE_ICONS.NPCS),
                    description: utilities.getRandomItemInArray(NPC_RACES) + " " + utilities.getRandomItemInArray(NPC_PROFESSIONS) + " - " + utilities.getRandomItemInArray(NPC_DESCRIPTIONS),
                    quest: "Find my dog!",
                };
            },
        },
        {
            name: "Kill 5 hellhounds",
            type: QUEST_TYPES.KILL,
            kill_count: 5,
            description: "Kill 5 hellhounds to save the town. Bring back their pelts to make valuable blankets that are always warm like you just got them out of the drier.",
            goal_monsters: ["Hellhound"],
            goal_item: {
                name:"Hellhound Pelt",
                count: 5,
                description: "If you return this to the quest giver they can turn this into an awesome forever-warm blanket.",
                icon:"images/pelt.png",
            },
            completion_message: "Thank you for killing the hellhounds! You saved the town, and now we have amazing magical blankets!",
            isAvailable: function(){
                return quests.isQuestCompleted("Kill a hellhound");
            },
        },
        {
            name: "Talk to the Old Man!",
            type: QUEST_TYPES.TALK,
            description: "Send word to Old Man RiverBeard that his grandson has just been born. He needs to know the good news!",
            goal_npc_name: "Old Man RiverBeard",
            goal_npc_icon: null,
            goal_npc_description: "An old man, wise from years of experience, happy and sad time.",
            completion_message: "Thank you for telling me. It warms my heart to know this world is filled with new life!",
            isAvailable: function(){
                return true;
            },
        },
        {
            name: "Find the Dungeon of Canthdor the Wicked",
            type: QUEST_TYPES.COMPLETE_DUNGEON,
            description: "A sacred family heirloom of mine was taken by bandits into the dungeon of Canthdor. He is an evil wizard that will buy creatures or even people for his experiments.",
            goal_dungeon_name: "Dungeon of Canthdor the Wicked",
            goal_item: "Family Heirloom",
            completion_message: "Thank you for finding my family's heirloom!",
            isAvailable: function(){
                return true;
            },
        },
        {
            name: "Find the map!",
            description: "An evil wizard rules this land. There is a map to his secret hideaway somewhere in the wilderness. Find it so you can find the wizard.",
            goal_item: "Wizard Map",
            goal_item_description: "A map to the wizard. It is written in ancient runes. Go back to the Quest Giver to get it translated.",
            completion_message: "Thanks for finding the map! It will help us in our quest.",
            isAvailable: function(){
                return true;
            },
        },
        {
            name: "Find the sword!",
            description: "The map leads to a sword long buried. It will hold the key to locating the Wizard's portal. Find it so that you may find the Wizard.",
            goal_item: "Lightly Glowing Sword",
            goal_item_description: "An ancient sword, no longer usable, but still glows with magic sometimes.",
            completion_message: "Thanks for finding this important item for locating the wizard!",
            isAvailable: function(){
                return quests.isQuestCompleted("Find the map!");
            },
        },
        {
            name: "Kill the Wizard!",
            description: "You can now locate the wizard with the old sword. It will glow when near, allowing you to find the hideout.",
            goal_item: "Wizard's Head",
            goal_item_description: "You killed the wizard! Great Job! The land of Dagu is now free once again!",
            completion_message: "Thank you for saving the realm!",
            isAvailable: function(){
                return quests.isQuestCompleted("Find the sword!");
            },
        },
        */
    ],
};