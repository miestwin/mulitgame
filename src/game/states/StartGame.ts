import 'p2';
import 'pixi';
import 'phaser';
import { randomNumberInRange } from '../../utils';
import { pointStars } from '../../engine';
import { States } from './States';

import Network from '../network';

import { Player, Shield, Bullets, Meteor } from '../../models';

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
    private points: Phaser.Group;

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
    private meteors: Phaser.Group;

    /**
     * Kolekcja bonusów możliwych do zebrania
     * @private
     * @type {Phaser.Group}
     * @memberof StartGame
     */
    private powerUps: Phaser.Group;

    /**
     * Tło gry
     * @private
     * @type {Phaser.TileSprite}
     * @memberof StartGame
     */
    private backTile: Phaser.TileSprite;

    private nebula: Phaser.TileSprite;

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

        // Network.getAllPlayers();
    }

    create() {
        this.players = this.game.add.group();
        this.shields = this.game.add.group();

        const filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('glow'));
        
        this.game.physics.setBoundsToWorld();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.backTile = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield');
        this.backTile.autoScroll(-300, 0);
        this.nebula = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'nebula-1');
        this.nebula.autoScroll(-200, 0);
        // this.back.filters = [filter];

        Network.getAllPlayers();

        this.points = this.game.add.group();
        this.points.enableBody = true;
        this.points.physicsBodyType = Phaser.Physics.ARCADE;
        // for (let i = 0; i < 1300; i++) {
        //     const y = randomNumberInRange(30, this.game.world.height - 30);
        //     const x = randomNumberInRange(this.game.width, 50000);
        //     const point = this.points.create(x, y, 'plasma', randomNumberInRange(15, 27));
        //     point.anchor.setTo(0.5);
        //     point.scale.setTo(0.3);
        //     point.checkWorldBounds = true;
        //     point.events.onOutOfBounds.add(this.pointOut, this);
        //     point.body.velocity.x = randomNumberInRange(-600, -700);
        //     // point.animations.add('transform');
        //     // point.animations.play('transform', 13, true);
        //     this.points.add(point);
        // }

        this.meteors = this.game.add.group();
        this.powerUps = this.game.add.group();
        this.bullets = new Bullets(this.game);

        // debug
        this.game.time.advancedTiming = true;
    }

    update() {  
        Object.keys((<any>this.game.state).players).forEach(playerId => {
            const player = (<any>this.game.state).players[playerId];
            
        });

        this.generatePoint();
        this.generateMeteor();

        this.game.physics.arcade.overlap(
                this.players,
                this.points, this.player_point_CollisionHandler, null, this);

        this.game.physics.arcade.overlap(
                this.shields,
                this.points, this.shield_point_CollisionHandler, null, this);

        this.game.physics.arcade.overlap(
            this.bullets, this.meteors, this.bullet_meteor_CollisionHandler, null, this);

        this.game.debug.text(this.time.fps.toString(), 2, 14, "#00ff00");
    }

    private generatePoint() {
        const pointChance = this.game.rnd.integerInRange(1, 10)
        if (pointChance != 1) {
            return;
        }
        const y = randomNumberInRange(30, this.game.world.height - 30);
        const point = this.points.create(this.game.world.width, y, 'plasma', randomNumberInRange(15, 27));
        point.anchor.setTo(0.5);
        point.scale.setTo(0.3);
        point.checkWorldBounds = true;
        point.events.onOutOfBounds.add(this.pointOut, this);
        point.body.velocity.x = randomNumberInRange(-600, -700);
        // point.animations.add('transform');
        // point.animations.play('transform', 13, true);
        this.points.add(point);
    }

    private generateMeteor() {
        const meteorChance = this.game.rnd.integerInRange(1, 100)
        if (meteorChance != 1) {
            return;
        }
        const meteor = new Meteor(this.game, this.game.world.width, this.game.rnd.integerInRange(20, this.game.world.height - 20));
        meteor.body.velocity.x = this.game.rnd.integerInRange(-500, -600);
        this.meteors.add(meteor);
    }

    private generatePowerUp(sx: number, sy: number) {
        const powerUpChance = this.game.rnd.integerInRange(1, 15);
        if (powerUpChance != 1) {
            return;
        }
        console.log('create power up');
    }

    private pointOut(point: Phaser.Sprite) {
        if (point.x < 0) {
            point.destroy();
        }
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

    private bullet_meteor_CollisionHandler(bullet: Phaser.Sprite, meteor: Meteor) {
        bullet.kill();
        meteor.health -= 1;
        if (meteor.health <= 0) {
            this.generatePowerUp(meteor.x, meteor.y);
            meteor.kill();
        }
    }

    shutdown() {
        Network.removeListener(Network.ALL_PLAYERS);
        Network.removeListener(Network.UPDATE_PLAYER_XY);
        Network.removeListener(Network.UPDATE_PLAYER_Z);
        Network.removeListener(Network.PLAYER_DISCONNECTED);
    }
}