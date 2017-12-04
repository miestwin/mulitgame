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
    Shield,
    Bullets,
    Comets,
    Elements,
    IPowerUp,
    PowerUpPull,
    PowerUpShield,
    ScoreText,
    Comet
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
     * Kolekcja tarcz graczy do sprawdania kolizji
     * 
     * @private
     * @type {Phaser.Group}
     * @memberof Main
     */
    private shields: Phaser.Group;

    /**
     * Kolekcja poczisków którymi strzelają gracze
     * Sprawdzanie kolizji
     * @private
     * @type {Bullets}
     * @memberof Main
     */
    private bullets: Bullets;

    /**
     * Kolekcja obiektów z któych wypadają ulepszenia
     * po ich zniszczeniu
     * @private
     * @type {Phaser.Group}
     * @memberof Main
     */
    private comets: Comets;

    /**
     * Kolekcja bonusów możliwych do zebrania
     * @private
     * @type {Phaser.Group}
     * @memberof Main
     */
    private powerUps: Phaser.Group;

    /**
     * Kolekcja obiektów do zbierania przez graczy
     * @private
     * @type {Phaser.Group}
     * @memberof Main
     */
    private points: Elements;

    /**
     * Wiadomość informująca kiedy zacznie się gra
     * @private
     * @type {Phaser.Text}
     * @memberof Main
     */
    private timerText: Phaser.Text;

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

    private gameEndInterval;

    preload() {
        // utworzenie słownika graczy
        (<any>this.game.state).players = {};

        this.players = this.game.add.group();
        this.shields = this.game.add.group();

        // aktualizacja połączonych graczy
        Network.onUpdatePlayersState((player) => {
            if (!(<any>this.game.state).players[player.id]) {
                const count = Object.keys((<any>this.game.state).players).length;
                const start = (this.game.world.centerY / 2) + 100;
                const offset = (this.game.world.centerY / 4) * (count - 1);
                const y = start + offset; 
                const newPlayer = new Player(this.game, 50, y,
                    { id: player.id, socketId: player.socketID, avatar: player.character });
                const newShield = new Shield(this.game, 50, y, player.id);
                newPlayer.shield = newShield;
                (<any>this.game.state).players[player.id] = newPlayer;
                this.players.add(newPlayer);
                this.shields.add(newShield);
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
                setTimeout(() => {
                    this.gameStartedFlag = true;
                }, 3000);
                this.gameEndInterval = setInterval(() => {
                    this.gameEndedFlag = true;
                    clearInterval(this.gameEndInterval);
                }, 30000);
            }
        });

        Network.onPlayedUpdateXY((playerId, update) => {
            console.log(playerId);
           const player = (<any>this.game.state).players[playerId];
           player.vector = new Victor(update.x, update.y); // .rotateDeg(player.angle);
        });

        Network.onPlayerUpdateZ((playerId, update) => {
            const player = (<any>this.game.state).players[playerId];
            player.zPos = update;
        });

        Network.onPlayerFire((playerId) => {
            const player = (<any>this.game.state).players[playerId];
            this.bullets.shoot(player.x, player.y);
        });

        Network.onNoConnectedPlayers(() => {
            this.game.state.start(States.MESSAGE, true, false, 'No connected players');
        });

        Network.startTimer();
    }

    create() {
        this.game.physics.setBoundsToWorld();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.points = new Elements(this.game);
        this.comets = new Comets(this.game);
        this.bullets = new Bullets(this.game);
        this.powerUps = this.game.add.group();

        this.createBackground();
        this.createMenu();

        // debug
        this.game.time.advancedTiming = true;
    }

    update() {
        if (this.gameStartedFlag && !this.gameEndedFlag) {
            this.points.generate();
            this.comets.generate();
        }

        this.endGame();
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
            this.game.world.centerX, 60,
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
            this.game.world.centerX, this.game.height - 60, 'The game will start in ...',
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
        }, this);
    }

    /**
     * Koniec gry
     * @private
     * @memberof Main
     */
    private endGame() {
        if (this.gameEndedFlag && this.points.countLiving() === 0 && this.comets.countLiving() === 0) {
            this.shutdown();

            const players = [];
            let bestScore = 0;
            let winner;
            Object.keys((<any>this.game.state).players).forEach((playerId) => {
                players.push((<any>this.game.state).players[playerId]);
            });
            players.sort((a: Player, b: Player) => a.score - b.score);
            players.forEach((player: Player, index: number, arr: Player[]) => {
                const count = arr.length;
                const stepY = this.game.world.centerY / count;
                const offsetY = stepY / 2;
                const y = stepY * (index + 1) + (offsetY * (count - 1));
                const stepX = (50 * arr.length) / count;
                const offsetX = stepX / 2;
                const x = stepX * (index + 1) + (offsetX * (count - 1));
                player.x = x + 30;
                player.y = y;
                player.vector = new Victor(0, 0);
            });

            Network.gameEnd((<any>this.game.state).id, players[players.length - 1].id);
        }
    }

    private checkCollisions() {
        this.game.physics.arcade.overlap(
            this.players,
            this.points, this.player_point_CollisionHandler, null, this);

        this.game.physics.arcade.overlap(
            this.players,
            this.comets, this.player_comet_CollisionHandler, null, this);

        this.game.physics.arcade.overlap(
            this.players,
            this.powerUps, this.player_powerup_CollisionHandler, null, this);

        this.game.physics.arcade.overlap(
            this.shields,
            this.points, this.shield_point_CollisionHandler, null, this);

        this.game.physics.arcade.overlap(
            this.bullets,
            this.comets, this.bullet_comet_CollisionHandler, null, this);
    }

    private player_point_CollisionHandler(player: Player, point: Phaser.Sprite) {
        player.score += 1;
        point.kill();
        new ScoreText(this.game, player.x, player.y - (player.height / 2), '+1', '#00FF00');
        Network.updatePlayerScore(player.id, player.socket, player.score);
    }

    private player_comet_CollisionHandler(player: Player, comet: Comet) {
        // && !comet.checkLastCollision(player)
        if (player.shield.scale.x < 0.3) {
            player.score -= 10;
            new ScoreText(this.game, player.x, player.y - (player.height / 2), '-10', '#FF0000');
            // comet.kill();
            Network.updatePlayerScore(player.id, player.socket, player.score);
        }
    }

    private shield_point_CollisionHandler(shield: Shield, point: Phaser.Sprite) {
        const player = (<any>this.game.state).players[shield.playerId];
        player.score += 1;
        point.kill();
        Network.updatePlayerScore(player.id, player.socket, player.score);
    }

    private bullet_comet_CollisionHandler(bullet: Phaser.Sprite, comet: Comet) {
        bullet.kill();
        comet.health -= 1;
        if (comet.health <= 0) {
            this.generatePowerUp(comet.x, comet.y);
             // comet.playExplosion();
            comet.kill();
        }
    }

    private player_powerup_CollisionHandler(player: Player, pu) {
        pu.powerup(player);
        pu.destroy();
    }

    private generatePowerUp(x: number, y: number) {
        const chance = rnd.integerInRange(1, 20);
        if (chance != 1) return;
        const pu = new PowerUpShield(this.game, x, y);
        pu.body.velocity.x = -400;
        this.powerUps.add(pu);
    }
}