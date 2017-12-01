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
    ScoreText
} from '../../models';

declare var Victor;

/**
 * Start rozgrywki
 * @export
 * @class Boot
 * @extends {Phaser.State}
 */
export class StartGame extends Phaser.State {

    /**
     * Kolekcja teł gry
     * @private
     * @type {Phaser.TileSprite[]}
     * @memberof StartGame
     */
    private tiles: Phaser.TileSprite[] = [];

    /**
     * Kolekcja obiektów do zbierania przez graczy
     * @private
     * @type {Phaser.Group}
     * @memberof StartGame
     */
    private points: Elements;

    /**
     * Kolekcja graczy do sprawdzania kolizji
     * @private
     * @type {Phaser.Group}
     * @memberof StartGame
     */
    private players: Phaser.Group;

    /**
     * Kolekcja tarcz graczy do sprawdania kolizji
     * 
     * @private
     * @type {Phaser.Group}
     * @memberof StartGame
     */
    private shields: Phaser.Group;

    /**
     * Kolekcja poczisków którymi strzelają gracze
     * Sprawdzanie kolizji
     * @private
     * @type {Bullets}
     * @memberof StartGame
     */
    private bullets: Bullets;

    /**
     * Kolekcja obiektów z któych wypadają ulepszenia
     * po ich zniszczeniu
     * @private
     * @type {Phaser.Group}
     * @memberof StartGame
     */
    private comets: Comets;

    /**
     * Kolekcja bonusów możliwych do zebrania
     * @private
     * @type {Phaser.Group}
     * @memberof StartGame
     */
    private powerUps: Phaser.Group;

    private gameEndInterval;

    private gameEndFlag: boolean = false;

    private collidedComets: { playerId: Set<Phaser.Sprite> };

    preload() {
        Network.onGetAllPlayers((players) => {
            Object.keys(players).forEach((playerId, index, playersId) => {
                const count = playersId.length;
                const step = this.game.world.centerY / count;
                const offset = step / 2;
                const y = step * (index + 1) + (offset * (count - 1)); 
                const player = new Player(this.game, 50, y, { id: players[playerId].id, socketId: players[playerId].socketID, avatar: players[playerId].character });
                const shield = new Shield(this.game, 50, y, player.id);
                player.shield = shield;
                (<any>this.game.state).players[playerId] = player;
                this.players.add(player);
                this.shields.add(shield);

                // this.collidedComets[playerId] = new Set();
            });
        });

        Network.onPlayedUpdateXY((playerId, update) => {
           const player = (<any>this.game.state).players[playerId];
           player.vector = new Victor(update.x, update.y).rotateDeg(player.angle);
        });

        Network.onPlayerUpdateZ((playerId, update) => {
            const player = (<any>this.game.state).players[playerId];
            player.zPos = update;
        });

        Network.onPlayerFire((playerId) => {
            const player = (<any>this.game.state).players[playerId];
            this.bullets.shoot(player.x, player.y);
        });

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

        Network.onNoConnectedPlayers(() => {
            this.game.state.start(States.MESSAGE, true, false, 'No connected players');
        });

        Network.getAllPlayers();
    }

    create() {
        this.players = this.game.add.group();
        this.shields = this.game.add.group();

        const filter = new Phaser.Filter(this.game, null, this.game.cache.getShader(Assets.Shaders.Glow.getName()));
        
        this.game.physics.setBoundsToWorld();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        const backTile = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, Const.Stars.getName());
        backTile.filters = [filter];
        backTile.autoScroll(-100, 0);
        this.tiles.push(backTile);
        for (let i = 0; i < Const.Nebula.Names.length; i++) {
            const nebulaback = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, Const.Nebula.Names[i]);
            nebulaback.autoScroll(-100, 0);
            this.tiles.push(nebulaback);
        }


        this.points = new Elements(this.game);
        this.comets = new Comets(this.game);
        this.bullets = new Bullets(this.game);
        this.powerUps = this.game.add.group();

        // debug
        this.game.time.advancedTiming = true;

        this.gameEndInterval = setInterval(() => {
            this.gameEndFlag = true;
            clearInterval(this.gameEndInterval);
        }, 30000);
    }

    update() {
        if (!this.gameEndFlag) {
            this.points.generate();
            this.comets.generate();
        }
            
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

        if (this.gameEndFlag && this.points.countLiving() === 0 && this.comets.countLiving() === 0) {
            this.removeListeners();

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

        this.game.debug.text(this.time.fps.toString(), 2, 14, "#00ff00");
    }

    private player_point_CollisionHandler(player: Player, point: Phaser.Sprite) {
        player.score += 1;
        point.kill();
        new ScoreText(this.game, player.x, player.y - (player.height / 2), Assets.Images.ScoreText.Plus.getName());
        Network.updatePlayerScore(player.id, player.socket, player.score);
    }

    private player_comet_CollisionHandler(player: Player, comet: Phaser.Sprite) {
        if (player.shield.scale.x < 0.3) {
            player.score -= 10;
            new ScoreText(this.game, player.x, player.y - (player.height / 2), Assets.Images.ScoreText.Minus10.getName());
            Network.updatePlayerScore(player.id, player.socket, player.score);
        }
    }

    private shield_point_CollisionHandler(shield: Shield, point: Phaser.Sprite) {
        const player = (<any>this.game.state).players[shield.playerId];
        player.score += 1;
        point.kill();
        Network.updatePlayerScore(player.id, player.socket, player.score);
    }

    private bullet_comet_CollisionHandler(bullet: Phaser.Sprite, comet: Phaser.Sprite) {
        bullet.kill();
        comet.health -= 1;
        if (comet.health <= 0) {
            this.generatePowerUp(comet.x, comet.y);
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

    private removeListeners() {
        Network.removeListener(Network.ALL_PLAYERS);
        Network.removeListener(Network.UPDATE_PLAYER_XY);
        Network.removeListener(Network.UPDATE_PLAYER_Z);
        Network.removeListener(Network.PLAYER_DISCONNECTED);
        Network.removeListener(Network.NO_CONNECTED_PLAYERS);
    }

    shutdown() {
        this.removeListeners();
    }
}