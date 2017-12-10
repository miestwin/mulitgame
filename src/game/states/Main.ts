import 'p2';
import 'pixi';
import 'phaser';

import { rnd } from '../../utils';
import { States } from './States';
import { Const } from '../../const';
import Network from '../network';
import { Assets } from '../../assets';
import {
    Player,
    Bullets,
    Comets,
    ScoreText,
    CometExplosion,
    IPowerUp,
    ResetPointsPowerUp,
    UntouchtablePowerUp,
    LittleDoctorPowerUp,
    MultiWeaponPowerUp
} from '../../models';

declare var Victor;

/**
 * Widok główny
 * @export
 * @class Main
 * @extends {Phaser.State}
 */
export class Main extends Phaser.State {

    /**
     * Kolekcja teł gry
     * @private
     * @type {Phaser.TileSprite[]}
     * @memberof Main
     */
    private tiles: Phaser.TileSprite[] = [];

    /**
     * Objekty należące do menu
     * @private
     * @type {Phaser.Group}
     * @memberof Main
     */
    private menuGroup: Phaser.Group;

    /**
     * Kolekcja graczy do sprawdzania kolizji
     * @private
     * @type {Phaser.Group}
     * @memberof Main
     */
    private players: Phaser.Group;

    /**
     * Kolekcja obiektów z któych wypadają ulepszenia
     * po ich zniszczeniu
     * @private
     * @type {Phaser.Group}
     * @memberof Main
     */
    private comets: Comets;

    /**
     * Kolekcja eksplozji komet
     * @private
     * @type {CometExplosion}
     * @memberof Main
     */
    private explosions: CometExplosion;

    /**
     * Kolekcja bonusów możliwych do zebrania
     * @private
     * @type {Phaser.Group}
     * @memberof Main
     */
    private powerUps: Phaser.Group;

    /**
     * Wiadomość informująca kiedy zacznie się gra
     * @private
     * @type {Phaser.Text}
     * @memberof Main
     */
    private timerText: Phaser.Text;

    /**
     * Flaga do wystartowania następnego poziomu
     * @private
     * @type {boolean}
     * @memberof Main
     */
    private startNextStage: boolean = false;

    /**
     * Czas do następnego poziomu
     * @private
     * @type {*}
     * @memberof Main
     */
    private nextStageTimeout: any;

    /**
     * Aktualny poziom
     * @private
     * @type {number}
     * @memberof Main
     */
    private currentStage: number = 1;

    /**
     * Flaga informująca o rozpoczęciu gry
     * @private
     * @type {boolean}
     * @memberof Main
     */
    private gameStartedFlag: boolean = false;

    /**
     * Flaga informująca o zakończeniu gry
     * @private
     * @type {boolean}
     * @memberof Main
     */
    private gameEndedFlag: boolean = false;
    private gameEndingFlag: boolean = false;

    /**
     * Czas do końca gry
     * @private
     * @type {*}
     * @memberof Main
     */
    private gameEndTimmeout: any;

    preload() {
        // utworzenie słownika graczy
        (<any>this.game.state).players = {};

        this.players = this.game.add.group();

        // aktualizacja połączonych graczy
        Network.onUpdatePlayersState((player) => {
            if (!(<any>this.game.state).players[player.id]) {
                const count = Object.keys((<any>this.game.state).players).length;
                const start = (this.game.world.centerY / 2) + 100;
                const offset = (this.game.world.centerY / 4) * (count - 1);
                const y = start + offset; 
                const newPlayer = new Player(this.game, 50, y,
                    { id: player.id, socketId: player.socketID, avatar: player.character });
                (<any>this.game.state).players[player.id] = newPlayer;
                this.players.add(newPlayer);
            }
        });

        // usuń gracza z gry
        Network.onPlayerDisconnected((player) => {
            (<any>this.game.state).players = Object.keys((<any>this.game.state).players).reduce((players, nextId) => {
                if ((<any>this.game.state).players[nextId].id == player.id) {
                    (<any>this.game.state).players[nextId].shield.destroy();
                    (<any>this.game.state).players[nextId].destroy();
                    return players;
                }
                players[nextId] = (<any>this.game.state).players[nextId];
                return players;
            }, {});
        });

        Network.onUpdateTimer((sec) => {
            this.timerText.setText('The game will start in ' + sec);
        });

        Network.onStartGame(() => {
            if (Object.keys((<any>this.game.state).players).length < 1) {
                const message = 'No connected players';
                const text = 'Try again';
                const action = () => this.game.state.start(States.MAIN_MENU);
                this.game.state.start(States.MESSAGE, true, false, message, text, action);
            } else {
                this.hideMenu();
                this.gameEndTimmeout = setTimeout(() => {
                    this.gameEndedFlag = true;
                    this.gameStartedFlag = false;
                    this.gameEndTimmeout = null;
                }, 90000);
            }
        });

        Network.onPlayedUpdateXY((playerId, update) => {
            const player = (<any>this.game.state).players[playerId];
            player.vector = new Victor(update.x, update.y);
        });

        Network.onPlayerUpdateZ((playerId, update) => {
            const player = (<any>this.game.state).players[playerId];
            player.zPos = update;
        });

        Network.onPlayerFire((playerId) => {
            const player = (<any>this.game.state).players[playerId];
            player.shoot();
        });

        Network.onNoConnectedPlayers(() => {
            this.game.state.start(States.MESSAGE, true, false, 'No connected players');
        });

        Network.onPlayAgain(() => {
            this.game.state.start(States.MAIN);
        });

        Network.startTimer();
    }

    create() {
        this.game.physics.setBoundsToWorld();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.comets = new Comets(this.game);
        this.explosions = new CometExplosion(this.game);

        this.createBackground();
        this.createMenu();

        // debug
        this.game.time.advancedTiming = true;
    }

    update() {
        if (this.gameStartedFlag && !this.gameEndedFlag) {
            this.comets.generate();
        }

        if (this.startNextStage && (this.comets.countLiving() === 0) && !this.gameEndedFlag) {
            this.startNextStage = false;
            this.createStageInfo();
            this.generatePowerUps();
            this.nextStage();
        }

        if (this.gameEndedFlag && (this.comets.countLiving() === 0) && !this.gameEndingFlag) {
            this.gameEndingFlag = true;
            this.endGame();
        }

        this.checkCollisions();

        this.game.debug.text(this.time.fps.toString(), 2, 14, "#00ff00");
    }

    shutdown() {
        Network.removeListener(Network.UPDATE_PLAYER_XY);
        Network.removeListener(Network.UPDATE_PLAYER_Z);
        Network.removeListener(Network.PLAYER_DISCONNECTED);
        Network.removeListener(Network.NO_CONNECTED_PLAYERS);
        Network.removeListener(Network.UPDATE_PLAYERS_STATE);
        Network.removeListener(Network.UPDATE_TIMER);
        Network.removeListener(Network.START_GAME);

        if (this.nextStageTimeout) {
            clearTimeout(this.nextStageTimeout);
        }
        if (this.gameEndTimmeout) {
            clearTimeout(this.gameEndTimmeout);
        }
    }

    /**
     * Utworzenie teł gry
     * @private
     * @memberof Main
     */
    private createBackground() {
        const backTile = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, Const.Stars.getName());
        backTile.autoScroll(-100, 0);
        this.tiles.push(backTile);
        for (let i = 0; i < Const.Nebula.Names.length; i++) {
            const nebulaback = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, Const.Nebula.Names[i]);
            nebulaback.autoScroll(-100, 0);
            this.tiles.push(nebulaback);
        }
    }

    /**
     * Utworzenie menu
     * @private
     * @memberof Main
     */
    private createMenu() {
        this.menuGroup = this.game.add.group();

        // tytuł gry
        const instruction = this.game.add.text(
            this.game.world.centerX, 100,
            'Scan QRCode and join to the game',
            { 
                font: `30px ${Assets.Fonts.Kenvector.getFamily()}`,
                fill: '#ffffff',
                align: 'center'
            });
        instruction.anchor.set(0.5);

        // kod qr
        const qr = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'qrcode');
        qr.anchor.set(0.5);

        this.timerText = this.game.add.text(
            this.game.world.centerX, this.game.height - 100, 'The game will start in ...',
            {
                font: `30px ${Assets.Fonts.Kenvector.getFamily()}`,
                fill: '#ffffff',
                align: 'center'
            });
        this.timerText.anchor.set(0.5);

        this.menuGroup.add(instruction);
        this.menuGroup.add(qr);
        this.menuGroup.add(this.timerText);
    }

    /**
     * Usunięcie menu przed rozpoczęciem rozgrywki
     * @private
     * @memberof Main
     */
    private hideMenu() {
        const moveUpTween = this.game.add.tween(this.menuGroup.position).to({ y: -this.game.height }, 2000, Phaser.Easing.Linear.None, true);
        moveUpTween.onComplete.add(() => {
            this.game.tweens.remove(moveUpTween);
            this.menuGroup.destroy();
            this.startNextStage = true;
        }, this);
    }

    private nextStage() {
        this.nextStageTimeout = setTimeout(() => {
            this.gameStartedFlag = false;
            this.currentStage++;
            this.startNextStage = true;
            this.nextStageTimeout = null;
        }, 30000);
    }

    private createStageInfo() {
        this.menuGroup = this.game.add.group();

        const stage = this.game.add.text(
            this.game.world.centerX, 50,
            'Stage ' + this.currentStage,
            { 
                font: `40px ${Assets.Fonts.Kenvector.getFamily()}`,
                fill: '#ffffff',
                align: 'center'
            });
        stage.anchor.set(0.5);

        const instruction = this.game.add.text(
            this.game.world.centerX, 100, 
            'Pick up power up',
            {
                font: `30px ${Assets.Fonts.Kenvector.getFamily()}`,
                fill: '#ffffff',
                align: 'center'
            });
        instruction.anchor.set(0.5);

        this.menuGroup.add(stage);
        this.menuGroup.add(instruction);

        const moveUpTween = this.game.add.tween(this.menuGroup.position).to({ y: -this.game.height }, 1000, Phaser.Easing.Linear.None, true, 10000);
        moveUpTween.onComplete.add(() => {
            this.game.tweens.remove(moveUpTween);
            this.menuGroup.destroy();
            this.destroyPowerUps();
            this.gameStartedFlag = true;
        }, this); 
    }

    /**
     * Koniec gry
     * @private
     * @memberof Main
     */
    private endGame() {
        this.shutdown();

        const players = [];
        Object.keys((<any>this.game.state).players).forEach((playerId) => {
            players.push((<any>this.game.state).players[playerId]);
        });
        players.sort((a: Player, b: Player) => a.score - b.score);
        players.forEach((player: Player, index: number, arr: Player[]) => {
            player.vector = new Victor(0, 0);
            const count = arr.length;
            const stepY = this.game.world.centerY / count;
            const offsetY = stepY / 2;
            const y = stepY * (index + 1) + (offsetY * (count - 1));
            const stepX = (50 * arr.length) / count;
            const offsetX = stepX / 2;
            const x = stepX * (index + 1) + (offsetX * (count - 1));
            const moveToX = this.game.add.tween(player).to({ x: x + 30 }, 1000, Phaser.Easing.Linear.None, true);
            const moveToY = this.game.add.tween(player).to({ y: y }, 1000, Phaser.Easing.Linear.None, true);
            moveToX.onComplete.add(() => {
                const text = this.game.add.text(x + player.width + 20, y, player.score.toString(), {
                    font: `30px ${Assets.Fonts.Kenvector.getFamily()}`,
                    fill: '#ffffff',
                    align: 'center'
                });
                text.anchor.setTo(0, 0.5);
            }, this);
        });

        Network.gameEnd((<any>this.game.state).id, players[players.length - 1].id);

        this.createEndMenu();
    }

    private createEndMenu() {
        const text = this.game.add.text(this.game.world.centerX, 100,
        'If you want play again\npress "PLAY AGAIN" in your controller',
        {
            font: `30px ${Assets.Fonts.Kenvector.getFamily()}`,
            fill: '#ffffff',
            align: 'center'
        });
        text.anchor.setTo(0.5);
    }

    /**
     * Sprawdzanie kolizji
     * @private
     * @memberof Main
     */
    private checkCollisions() {

        this.game.physics.arcade.overlap(
            this.players,
            this.comets, this.player_comet_CollisionHandler, null, this);

        this.game.physics.arcade.overlap(
            this.players,
            this.powerUps, this.player_powerup_CollisionHandler, null, this);

        Object.keys((<any>this.game.state).players).forEach((playerId) => {
            const player: Player = (<any>this.game.state).players[playerId];

            const collisionHandler = (bullet: Phaser.Sprite, comet: Phaser.Sprite) => {
                bullet.kill();
                comet.health -= player.bullets.damage;
                if (comet.health <= 0) {
                    this.explosions.generate(comet.x, comet.y);
                    player.score += (comet.height / 3);
                    Network.updatePlayerScore(player.id, player.socket, player.score, false);
                    comet.kill();
                }
            };

            this.game.physics.arcade.overlap(
                player.bullets,
                this.comets, collisionHandler, null, this);
        });
    }

    /**
     * Kolizja gracza z kometą
     * @private
     * @param {Player} player 
     * @param {Phaser.Sprite} comet 
     * @memberof Main
     */
    private player_comet_CollisionHandler(player: Player, comet: Phaser.Sprite) {
        if (player.untouchtable === false) {
            player.score -= 10;
            new ScoreText(this.game, player.x, player.y - (player.height / 2), '-10', '#FF0000');
            this.explosions.generate(comet.x, comet.y);
            comet.kill();
            Network.updatePlayerScore(player.id, player.socket, player.score, true);
        }
    }

    /**
     * Kolizja gracza ze wzmocnieniem
     * @private
     * @param {Player} player 
     * @param {IPowerUp} powerup 
     * @memberof Main
     */
    private player_powerup_CollisionHandler(player: Player, powerup: IPowerUp) {
        powerup.powerup(player);
        player.powerups.push(powerup);
    }

    /**
     * Generowanie wzmocnień
     * @private
     * @memberof Main
     */
    private generatePowerUps() {
        this.players.forEach((player: Player) => {
            player.removePowerups();
        }, this);

        if (this.powerUps) {
            this.powerUps.destroy();
        }
        this.powerUps = this.game.add.group();

        this.powerUps.add(new MultiWeaponPowerUp(this.game,
            rnd.integerInRange(400, this.game.width - 100),
            rnd.integerInRange(100, this.game.height - 100)));
       
        this.powerUps.add(new LittleDoctorPowerUp(this.game,
            rnd.integerInRange(400, this.game.width - 100),
            rnd.integerInRange(100, this.game.height - 100)));

        this.powerUps.add(new MultiWeaponPowerUp(this.game,
            rnd.integerInRange(400, this.game.width - 100),
            rnd.integerInRange(100, this.game.height - 100)));

        this.powerUps.add(new UntouchtablePowerUp(this.game,
            rnd.integerInRange(400, this.game.width - 100),
            rnd.integerInRange(100, this.game.height - 100)));

        this.powerUps.add(new ResetPointsPowerUp(this.game,
            rnd.integerInRange(400, this.game.width - 100),
            rnd.integerInRange(100, this.game.height - 100),
            (player) => { Network.updatePlayerScore(player.id, player.socket, player.score, false); }));
    }

    /**
     * Usunięcie wzmocnień z planszy
     * @private
     * @memberof Main
     */
    private destroyPowerUps() {
        this.powerUps.forEach((powerup) => {
            if (powerup.player == null) {
                powerup.destroy();
            }
        }, this);
    }
}