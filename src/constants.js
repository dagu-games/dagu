const GRASS_ICON = "images/grass.png";
const TREE_ICON = "images/tree.png";
const STONE_ICON = "images/stone.png";
const DIRT_ICON = "images/dirt.png";
const NPC_ICON = "images/npc.png";
const HELLHOUND_ICON = "images/hellhound.png";
const WALL_ICON = "images/wall.png";
const HERO_ICON = "images/hero.png";
const CHUNK_SIZE = 100;
const STORAGE_STRING = "dagu_saves_array";
const ZOOM_MAX = 30;
const EXP_MULTIPLIER = 100;
const EXP_EXPONENT = 2;
const DONATION_STRING = "If you would like to donate to this game and me so that I can develop this game, please donate to dkihlken@gmail.com through paypal! Simply comment on the payment with the word \"dagu\" somewhere and I will add your name to the credits below!";

const DONATORS = [
    "Mackie Welter",
];


const STATUS = {
    COMBAT: "combat",
    COMBAT_SPELL_SELECTED: "combat_spell_selected",
    NPC_QUEST: "npc_quest",
    NPC_SHOP: "npc_shop",
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

const NPC_FIRST_NAMES = [
    "Jim",
    "Dave",
    "Bob",
    "Mackie",
    "Doug",
    "Mary",
];

const NPC_LAST_NAMES = [
    "Kihlken",
    "Anderson",
    "Welter",
    "Smith",
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

const QUESTS = [
    {
        name: "Find my dog!",
        description: "I lost my dog! can you help me find it? Some monsters took him from me!",
        goal_item: "Lost Dog",
        goal_item_description: "You found the lost dog! Take him back to his owner and they will reward you!"
    },
];

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

const TOWN_NAMES = [
    "Springville",
    "Nelthar",
    "Placeburg",
    "CityVillage",
];