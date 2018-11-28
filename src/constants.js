const VERSION = 0.1;
const GRASS_ICON = "images/grass.png";
const TREE_ICON = "images/tree.png";
const STONE_ICON = "images/stone.png";
const DIRT_ICON = "images/dirt.png";
const NPC_ICON = "images/npc.png";
const HELLHOUND_ICON = "images/hellhound.png";
const WALL_ICON = "images/wall.png";
const HERO_ICON = "images/hero.png";
const CHUNK_SIZE = 20;
const STORAGE_STRING = "dagu_saves_array";
const ZOOM_MAX = 30;
const EXP_MULTIPLIER = 100;
const EXP_EXPONENT = 2;
const CACHED_CHUNKS = 4;
const TICK_THRESHOLD = 5;
const CREDITS_STRING = "Game by Douglas Kihlken";
const DONATION_STRING = "If you would like to donate to this game and me so that I can develop this game, please donate to dkihlken@gmail.com through paypal! Simply comment on the payment with the word \"dagu\" somewhere and I will add your name to the credits below!";

const DONATORS = [
    "Mackie Welter, love and support",
    "Anna Anderson, occasional food provider",
];

const CHANGE_LOG = [
    "0.1 (American Shorthair) - For Menow, our first cat baby with a degenerative mouth disease. <br>Initial, in development version. Movement, basic input and output proof-of-concepts, placeholder art, and simple world generation are all implemented.",
];

const STATUS = {
    COMBAT: "combat",
    COMBAT_SPELL_SELECTED: "combat_spell_selected",
};

const WALKABLE_TILES = [
    "grass",
    "stone",
    "dirt",
];


const VISION_BLOCKING_TILES = [
    "tree",
    "bush",
    "wall",
];

const RACES = [
    "Human",
    "Elf",
    "Orc",
    "Goblin",
    "Tiefling",
    "Hobbit",
    "Dwarf"
];

const PROFESSIONS = [
    "Miner",
    "Merchant",
    "Farmer",
    "Adventurer",
    "Guard",
    "Blacksmith",
];

const NPC_DESCRIPTIONS = [
    "Gross, dirty, and worn from constant work.",
    "Neat and clean, as if from wealth.",
];

const QUESTS = {
    SIDE:[
        {
            name: "Find my dog!",
            description: "I lost my dog! can you help me find it? Some monsters took him from me!",
            goal_item: "Lost Dog",
            goal_item_description: "You found the lost dog! Take him back to his owner and they will reward you!",
            completion_message: "Thank you for finding me dog! I was worried sick!",
        },
    ],
    STORY:[
        {
            name: "Find the map!",
            description: "An evil wizard rules this land. There is a map to his secret hideaway somewhere in the wilderness. Find it so you can find the wizard.",
            goal_item: "Wizard Map",
            goal_item_description: "A map to the wizard. It is written in ancient runes. Go back to the Quest Giver to get it translated.",
            completion_message: "Thanks for finding the map! It will help us in our quest.",
        },
        {
            name: "Find the sword!",
            description: "The map leads to a sword long buried. It will hold the key to locating the Wizard's portal. Find it so that you may find the Wizard.",
            goal_item: "Lightly Glowing Sword",
            goal_item_description: "An ancient sword, no longer usable, but still glows with magic sometimes.",
            completion_message: "Thanks for finding this important item for locating the wizard!",
        },
        {
            name: "Kill the Wizard!",
            description: "You can now locate the wizard with the old sword. It will glow when near, allowing you to find the hideout.",
            goal_item: "Wizard's Head",
            goal_item_description: "You killed the wizard! Great Job! The land of Dagu is now free once again!",
            completion_message: "Thank you for saving the realm!",
        },
    ],
};

const ITEM_NAMES = {
    helmet: [
        "helm of cool",
    ],
    shoulders: [
        "shoulder guards of cool",
    ],
    gauntlets: [
        "gauntlets of cool",
    ],
    chest: [
        "chest of cool",
    ],
    belt: [
        "belt of cool",
    ],
    pants: [
        "pants of cool",
    ],
    boots: [
        "boots of cool",
    ],
    main_hand: [
        "sword of cool",
    ],
    off_hand: [
        "shield of cool",
    ],
    necklace: [
        "necklace of cool",
    ],
    ring: [
        "ring of cool",
    ],
};

const ITEM_DESCRIPTIONS = [
    "old and worn",
    "good as new",
    "made by the finest craftsmen",
];

const ITEM_SLOTS = [
    "helmet",
    "shoulders",
    "gauntlets",
    "chest",
    "belt",
    "pants",
    "boots",
    "main_hand",
    "off_hand",
    "necklace",
    "ring",
];

const KEY_CODES = {
    W:87,
    A:65,
    S:83,
    D:68,
    1:49,
};