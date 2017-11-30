export namespace Assets {

    export namespace Shaders {
        export class Glow {
            static getName(): string { return 'glow'; }
            static getFRAG(): string { return '../assets/shaders/glow.frag'; }
        }
        export class Pixelate {
            static getName(): string { return 'pixelate'; }
            static getFRAG(): string { return '../assets/shaders/pixelate.frag'; }
        }
    }

    export namespace Fonts {
        export class Kenvector {
            static getName(): string { return 'kenvector'; }
            static getFamily(): string { return 'Kenvector Future'; }
            static getWOFF(): string { return '../assets/fonts/kenvector/kenvector_future-webfont.woff'; }
            static getWOFF2(): string { return '../assets/fonts/kenvector/kenvector_future-webfont.woff2'; }
        }
    }

    export namespace Spritesheets {
        export namespace Explosions {
            export class Three {
                static getName(): string { return 'explosion-3'; }
                static getPNG(): string { return '../assets/spritesheets/explosion-3.png'; }
                static getFrameWidth(): number { return 128; }
                static getFrameHeight(): number { return 80; }
                static getMargin(): number { return 0; }
                static getSpacing(): number { return 0; }
                static getFrameMax(): number { return 10; }
            }
        }

        export namespace Bullets {
            export class RGBLaser {
                static getName(): string { return 'rgb-laser'; }
                static getPNG(): string { return '../assets/spritesheets/rgblaser.png'; }
                static getFrameWidth(): number { return 4; }
                static getFrameHeight(): number { return 4; }
                static getMargin(): number { return 0; }
                static getSpacing(): number { return 0; }
            }
        }

        export class Plasma {
            static getName(): string { return 'plasma'; }
            static getPNG(): string { return '../assets/spritesheets/plasma.png'; }
            static getFrameWidth(): number { return 192; }
            static getFrameHeight(): number { return 192; }
            static getMargin(): number { return 0; }
            static getSpacing(): number { return 50; }
            static getFrameMax(): number { return 30; }
        }
    }

    export namespace Images {
        export class Shield {
            static getName(): string { return 'shield'; }
            static getPNG(): string { return '../assets/images/shield.png'; }
        }
        export class Transparent {
            static getName(): string { return 'transparent'; }
            static getPNG(): string { return '../assets/images/transparent.png'; }
        }
        export namespace PowerUps {
            export class Shield {
                static getName(): string { return 'power-up_shield'; }
                static getPNG(): string { return '../assets/images/power-ups/powerupYellow_shield.png'; }
            }
            export class Cooldown {
                static getName(): string { return 'power-up_cooldown'; }
                static getPNG(): string { return '../assets/images/power-ups/powerupYellow_bolt.png'; }
            }
            export class Pull {
                static getName(): string { return 'power-up_pull'; }
                static getPNG(): string { return '../assets/images/power-ups/powerupYellow_star.png'; }
            }
        }
        export namespace ScoreText {
            export class Plus {
                public static getName() { return 'plus-one'; }
                public static getPNG() { return '../assets/images/plusone.png'; }
            }
            export class Minus {
                public static getName() { return 'minus-one'; }
                public static getPNG() { return '../assets/images/minusone.png'; }
            }
        }
        export namespace Ships {
            export class GREEN {
                public static getName() { return 'player-ship_green'; }
                public static getValue() { return 0x33cc33; }
                public static getPNG() { return '../assets/images/ships/ship_green.png'; }
            }
            export class PURPLE {
                public static getName() { return 'player-ship_purple'; }
                public static getValue() { return 0x9933ff; }
                public static getPNG() { return '../assets/images/ships/ship_purple.png'; }
            }
            export class BLUE {
                public static getName() { return 'player-ship_blue'; }
                public static getValue() { return 0x0066ff; }
                public static getPNG() { return '../assets/images/ships/ship_blue.png'; }
            }
            export class WATERY {
                public static getName() { return 'player-ship_watery'; }
                public static getValue() { return 0x009999; }
                public static getPNG() { return '../assets/images/ships/ship_watery.png'; }
            }
            export class PINK {
                public static getName() { return 'player-ship_pink'; }
                public static getValue() { return 0xff3399; }
                public static getPNG() { return '../assets/images/ships/ship_pink.png'; }
            }
            export class RED {
                public static getName() { return 'player-ship_red'; }
                public static getValue() { return 0xcc2900; }
                public static getPNG() { return '../assets/images/ships/ship_red.png'; }
            }
            export class YELLOW {
                public static getName() { return 'player-ship_yellow'; }
                public static getValue() { return 0xd1d123; }
                public static getPNG() { return '../assets/images/ships/ship_yellow.png'; }
            }
            export class ORANGE {
                public static getName() { return 'player-ship_orange'; }
                public static getValue() { return 0xcc5200; }
                public static getPNG() { return '../assets/images/ships/ship_orange.png'; }
            }
            export class GRASS {
                public static getName() { return 'player-ship_grass'; }
                public static getValue() { return 0x739900; }
                public static getPNG() { return '../assets/images/ships/ship_grass.png'; }
            }
            export class DARKPINK {
                public static getName() { return 'player-ship_darkpink'; }
                public static getValue() { return 0x993333; }
                public static getPNG() { return '../assets/images/ships/ship_darkpink.png'; }
            }
        }
    }

    export namespace UI {
        export namespace Buttons {
            export namespace Arrows {
                export class Down {
                    static getName(): string { return 'btn-down'; }
                    static getPNG(): string { return '../assets/images/controller/shadedDark/shadedDark27.png'; }
                }
                export class Up {
                    static getName(): string { return 'btn-up'; }
                    static getPNG(): string { return '../assets/images/controller/shadedDark/shadedDark26.png'; }
                }
            }
            export namespace Joystick {
                export class WheelExternal {
                    static getName(): string { return 'joystick-external-wheel'; }
                    static getPNG(): string { return '../assets/images/controller/lineDark/lineDark46.png'; }
                }
                export class WheelInternal {
                    static getName(): string { return 'joystick-internal-wheel'; }
                    static getPNG(): string { return '../assets/images/controller/shadedDark/shadedDark11.png'; }
                }
            }
            export namespace Menu {
                export class Grey {
                    static getName(): string { return 'grey-menu-button'; }
                    static getPNG(): string { return '../assets/images/ui/grey_button04.png'; }
                }
            }
            export class Fire {
                static getName(): string { return 'btn-fire'; }
                static getPNG(): string { return '../assets/images/controller/shadedDark/shadedDark49.png'; }
            }
            export class Shield {
                static getName(): string { return 'btn-shield'; }
                static getPNG(): string { return '../assets/images/controller/shadedDark/shadedDark48.png'; }
            }
        }
    }

    export namespace Audio {
    }
}