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