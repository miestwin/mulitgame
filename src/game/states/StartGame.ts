import 'p2';
import 'pixi';
import 'phaser';
import { randomNumberInRange } from '../../utils';
import { pointStars } from '../../engine';
import { States } from './States';

import Network from '../network';

import { Player, Shard, Shield } from '../../models';

declare var Victor;

/**
 * Start rozgrywki
 * @export
 * @class Boot
 * @extends {Phaser.State}
 */
export class StartGame extends Phaser.State {

    private tiles: Phaser.TileSprite[] = [];
    private points: Phaser.Group;
    private players: Phaser.Group;
    private shields: Phaser.Group;
    private back: Phaser.TileSprite;

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
            console.log(playerId, 'fire');
        });

        Network.onPlayerDisconnected((player) => {
            (<any>this.game.state).players = Object.keys((<any>this.game.state).players).reduce((players, nextId) => {
                if ((<any>this.game.state).players[nextId].id == player.id) {
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

        this.back = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield');
        // this.back.filters = [filter];
        this.back.autoScroll(-300, 0);

        // for (let i = 1; i <= 1; i++) {
        //     const texture = pointStars(this.game, i * 0.00001, i);
        //     const tile = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, texture);
        //     if (i === 1) {
        //         tile.filters = [filter];
        //     }
        //     tile.autoScroll(-300 * i, 0);
        //     this.tiles.push(tile);
        // }

        Network.getAllPlayers();

        this.points = this.game.add.group();
        this.points.enableBody = true;
        this.points.physicsBodyType = Phaser.Physics.ARCADE;
        for (let i = 0; i < 1300; i++) {
            const y = randomNumberInRange(30, this.game.world.height - 30);
            const x = randomNumberInRange(this.game.width, 50000);
            const point = this.points.create(x, y, 'plasma', randomNumberInRange(15, 27));
            point.anchor.setTo(0.5);
            point.scale.setTo(0.3);
            point.checkWorldBounds = true;
            point.events.onOutOfBounds.add(this.pointOut, this);
            point.body.velocity.x = randomNumberInRange(-600, -700);
            // point.animations.add('transform');
            // point.animations.play('transform', 13, true);
            this.points.add(point);
        }

        // debug
        this.game.time.advancedTiming = true;
    }

    update() {  
        // Object.keys((<any>this.game.state).players).forEach(playerId => {
        //     (<any>this.game.state).players[playerId].update();

        //     this.game.physics.arcade.overlap(
        //         (<any>this.game.state).players[playerId],
        //         this.points, this.point_player_CollisionHandler, null, this);

        //     this.game.physics.arcade.overlap(
        //         (<any>this.game.state).players[playerId].shield,
        //         this.points, this.shield_point_CollisionHandler, null, this);
        // });

        this.game.physics.arcade.overlap(
                this.players,
                this.points, this.point_player_CollisionHandler, null, this);

        this.game.physics.arcade.overlap(
                this.shields,
                this.points, this.shield_point_CollisionHandler, null, this);

        this.game.debug.text(this.time.fps.toString(), 2, 14, "#00ff00");
    }

    // private electricFieldOut(field: Phaser.Sprite) {
    //     field.reset(this.game.width, randomNumberInRange(30, this.game.world.height - 30));
    //     field.body.velocity.x = randomNumberInRange(-450, -600);
    // }

    // private meteorOut(meteor: Phaser.Sprite) {
    //     meteor.reset(this.game.width, randomNumberInRange(30, this.game.world.height - 30));
    //     meteor.body.velocity.x = randomNumberInRange(-600, -700);
    // }

    private pointOut(point: Phaser.Sprite) {
        if (point.x < 0) {
            point.kill();
        }
    }

    private point_player_CollisionHandler(player: Player, point: Phaser.Sprite) {
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

    shutdown() {
        Network.removeListener(Network.ALL_PLAYERS);
        Network.removeListener(Network.UPDATE_PLAYER_XY);
        Network.removeListener(Network.UPDATE_PLAYER_Z);
        Network.removeListener(Network.PLAYER_DISCONNECTED);
    }
}
















// this.electricFields = this.game.add.group();
// this.electricFields.enableBody = true;
// this.electricFields.physicsBodyType = Phaser.Physics.ARCADE;
// for (let i = 0; i < 3; i++) {
//     const y = randomNumberInRange(30, this.game.world.height - 30);
//     const field = this.electricFields.create(this.game.width, y, 'electric-field', 0);
//     field.anchor.setTo(0, 0.5);
//     field.checkWorldBounds = true;
//     field.events.onOutOfBounds.add(this.electricFieldOut, this);
//     field.body.velocity.x = randomNumberInRange(-450, -600);
//     field.animations.add('electrify');
//     field.animations.play('electrify', 15, true);
//     this.electricFields.add(field);
// }