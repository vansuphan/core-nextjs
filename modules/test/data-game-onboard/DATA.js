export const DATA = [
    {
        rank: "common", type: "str",
        hp: { min: 192, max: 288 },
        attack: { min: 80, max: 100 },
        shield: { min: 64, max: 72 },
    },
    {
        rank: "common", type: "agi",
        hp: { min: 128, max: 192 },
        attack: { min: 96, max: 120 },
        shield: { min: 80, max: 90 },
    },
    {
        rank: "common", type: "int",
        hp: { min: 160, max: 240 },
        attack: { min: 64, max: 80 },
        shield: { min: 96, max: 108 },
    },



    {
        rank: "rare", type: "str",
        hp: { min: 240, max: 360 },
        attack: { min: 100, max: 125 },
        shield: { min: 80, max: 90 },
    },
    {
        rank: "rare", type: "agi",
        hp: { min: 160, max: 240 },
        attack: { min: 120, max: 150 },
        shield: { min: 100, max: 113 },
    },
    {
        rank: "rare", type: "int",
        hp: { min: 200, max: 300 },
        attack: { min: 80, max: 100 },
        shield: { min: 120, max: 135 },
    },



    {
        rank: "epic", type: "str",
        hp: { min: 300, max: 450 },
        attack: { min: 125, max: 156 },
        shield: { min: 100, max: 113 },
    },
    {
        rank: "epic", type: "agi",
        hp: { min: 200, max: 300 },
        attack: { min: 150, max: 188 },
        shield: { min: 125, max: 141 },
    },
    {
        rank: "epic", type: "int",
        hp: { min: 250, max: 375 },
        attack: { min: 100, max: 125 },
        shield: { min: 150, max: 169 },
    },



    {
        rank: "legend", type: "str",
        hp: { min: 375, max: 563 },
        attack: { min: 156, max: 195 },
        shield: { min: 125, max: 141 },
    },
    {
        rank: "legend", type: "agi",
        hp: { min: 250, max: 375 },
        attack: { min: 188, max: 234 },
        shield: { min: 156, max: 176 },
    },
    {
        rank: "legend", type: "int",
        hp: { min: 313, max: 469 },
        attack: { min: 125, max: 156 },
        shield: { min: 188, max: 211 },
    },

]

export const RANKS = {
    common: "common",
    rare: "rare",
    epic: "epic",
    legend: "legend",
}

export const PERCENT_DATA = {
    common: .5,
    rare: .3,
    epic: .2,
    legend: .1,
}

export const element_logic = [.8, 1, 1.2];

export const ELEMENT_STATS =
    [
        //          kim     moc     thuy    hoa     tho
        /*kim*/[1.0, 1.2, 1.0, 0.8, 1.0],
        /*moc*/[0.8, 1.0, 1.0, 1.0, 1.2],
        /*thuy*/[1.0, 1.0, 1.0, 1.2, 0.8],
        /*hoa*/[1.2, 1.0, 0.8, 1.0, 1.0],
        /*tho*/[1.0, 0.8, 1.2, 1.0, 1.0],
    ];

export const ELEMENTS = {
    METAL: "metal",
    WOOD: "wood",
    WATER: "water",
    FIRE: "fire",
    EARTH: "earth",
}

export const ELEMENT_ARRAY = [ELEMENTS.METAL, ELEMENTS.WOOD, ELEMENTS.WATER, ELEMENTS.FIRE, ELEMENTS.EARTH]


