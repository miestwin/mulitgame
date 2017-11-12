import 'p2';
import 'pixi';
import 'phaser';
import { rnd } from '../../utils';
import { States } from './States';
import { Const } from '../../const';
import Network from '../network';
import { Assets } from '../../assets';
import { Player, Shield, Bullets, Comets, Elements } from '../../models';

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
    }

    create() {
        this.players = this.game.add.group();
        this.shields = this.game.add.group();

        const filter = new Phaser.Filter(this.game, null, this.game.cache.getShader(Assets.Shaders.Glow.getName()));
        
        this.game.physics.setBoundsToWorld();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        const backTile = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, Const.Stars.getName());
        backTile.autoScroll(-300, 0);
        this.tiles.push(backTile);
        for (let i = 0; i < Const.Nebula.Names.length; i++) {
            const nebulaback = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, Const.Nebula.Names[i]);
            nebulaback.autoScroll(-200, 0);
            this.tiles.push(nebulaback);
        }

        Network.getAllPlayers();

        this.points = new Elements(this.game);
        this.comets = new Comets(this.game);
        this.bullets = new Bullets(this.game);
        this.powerUps = this.game.add.group();

        // debug
        this.game.time.advancedTiming = true;
    }

    update() {
        this.points.generate();
        this.comets.generate();

        this.game.physics.arcade.overlap(
            this.players,
            this.points, this.player_point_CollisionHandler, null, this);

        this.game.physics.arcade.overlap(
            this.shields,
            this.points, this.shield_point_CollisionHandler, null, this);

        this.game.physics.arcade.overlap(
            this.bullets,
            this.comets, this.bullet_comet_CollisionHandler, null, this);

        this.game.debug.text(this.time.fps.toString(), 2, 14, "#00ff00");
    }

    private player_point_CollisionHandler(player: Player, point: Phaser.Sprite) {
        player.score += 1;
        point.kill();
        Network.updatePlayerScore(player.id, player.socket, player.score);
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
            // this.generatePowerUp(comet.x, comet.y);
            comet.kill();
        }
    }

    shutdown() {
        Network.removeListener(Network.ALL_PLAYERS);
        Network.removeListener(Network.UPDATE_PLAYER_XY);
        Network.removeListener(Network.UPDATE_PLAYER_Z);
        Network.removeListener(Network.PLAYER_DISCONNECTED);
    }
}