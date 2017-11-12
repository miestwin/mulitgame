import { Color } from '../utils';

export namespace Const {
    export namespace Ships {
        export class GREEN {
            public static getName() { return 'player-ship_green'; }
            public static getValue() { return 0x33cc33; }
        }
        export class PURPLE {
            public static getName() { return 'player-ship_purple'; }
            public static getValue() { return 0x9933ff; }
        }
        export class BLUE {
            public static getName() { return 'player-ship_blue'; }
            public static getValue() { return 0x0066ff; }
        }
        export class WATERY {
            public static getName() { return 'player-ship_watery'; }
            public static getValue() { return 0x009999; }
        }
        export class PINK {
            public static getName() { return 'player-ship_pink'; }
            public static getValue() { return 0xff3399; }
        }
        export class RED {
            public static getName() { return 'player-ship_red'; }
            public static getValue() { return 0xcc2900; }
        }
        export class YELLOW {
            public static getName() { return 'player-ship_yellow'; }
            public static getValue() { return 0xd1d123; }
        }
        export class ORANGE {
            public static getName() { return 'player-ship_orange'; }
            public static getValue() { return 0xcc5200; }
        }
        export class GRASS {
            public static getName() { return 'player-ship_grass'; }
            public static getValue() { return 0x739900; }
        }
        export class DARKPINK {
            public static getName() { return 'player-ship_darkpink'; }
            public static getValue() { return 0x993333; }
        }
    }

    export namespace Nebula {
        export class PURPLE {
            public static getName() { return 'nebula_purple'; }
            public static getValue() { return new Color(179, 0, 179); }
        }
        export class ORANE {
            public static getName() { return 'nebula_orange'; }
            public static getValue() { return new Color(225, 51, 0); }
        }
        export class GREEN {
            public static getName() { return 'nebula_green'; }
            public static getValue() { return new Color(0, 153, 51); }
        }
        export const Colors = [new Color(179, 0, 179), new Color(225, 51, 0), new Color(0, 153, 51)];
        export const Names = [];
    }

    export namespace Comet {
        export const Names = [];
    }

    export class Stars {
        public static getName() { return 'starsfield'; }
    }

    export namespace Element {
        export const Colors = [0xccccff, 0xccffff, 0xb3ffb3, 0xffff99, 0xffb3ff, 0x99ccff];
        export const Names = [];
    }
}

// 'power-up_cooldown', 'power-up_pull', 'power-up_big'