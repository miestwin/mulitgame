import 'p2';
import 'pixi';
import 'phaser';
import { randomNumberInRange } from '../../utils';
import { generatePointStars } from '../../engine';
import { States } from './States';

import Network from '../network';

import { Player, Shard } from '../../models';

declare var Victor;

/**
 * Start rozgrywki
 * @export
 * @class Boot
 * @extends {Phaser.State}
 */
export class StartGame extends Phaser.State {

    private tiles: Phaser.TileSprite[] = [];
    private filter: Phaser.Filter;

    private shards = [];

    preload() {
        Network.onGetAllPlayers((players) => {
            Object.keys(players).forEach((playerId, index, playersId) => {
                const count = playersId.length;
                const step = this.game.world.centerY / count;
                const offset = step / 2;
                const y = step * (index + 1) + (offset * (count - 1));
                (<any>this.game.state).players[playerId] = 
                    new Player(this.game, 50, y, { id: players[playerId].id, socketId: players[playerId].socketID, avatar: players[playerId].character });
                // (<any>this.game.state).players[playerId].angle += 90;
            });
        });

        Network.onPlayedUpdateXY((playerId, update) => {
           const player = (<any>this.game.state).players[playerId];
           player.vector = new Victor(update.x, update.y);
        });

        Network.onPlayerDisconnected((player) => {
            // remove player
            (<any>this.game.state).players = Object.keys((<any>this.game.state).players).reduce((players, nextId) => {
                if ((<any>this.game.state).players[nextId].id == player.id) {
                    (<any>this.game.state).players[nextId].destroy();
                    return players;
                }
                players[nextId] = (<any>this.game.state).players[nextId];
                return players;
            }, {});
        });

        Network.getAllPlayers();
    }

    create() {
        const filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('glow'));
        // this.tile = this.game.add.tileSprite(0, 0, 50000,  this.game.width, 'background');
        this.game.world.setBounds(0, 0, this.game.width, this.game.height);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // this.tile.autoScroll(-200, 0);

        for (let i = 1; i <= 2; i++) {
            const texture = generatePointStars(this.game, i * 0.00001, i);
            const tile = this.game.add.tileSprite(0, 0, 50000, this.game.height, texture);
            if (i === 1) {
                tile.filters = [filter];
            }
            tile.autoScroll(-50 * i, 0);
            this.tiles.push(tile);
        }

        //this.filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('bacteria'));
        //this.filter.addToWorld(0, 0, this.game.width, this.game.height);

        for (let i = 0; i < 5; i++) {
            this.shards.push(new Shard(this.game, randomNumberInRange(50, this.game.world.width - 50), randomNumberInRange(50, this.game.world.height - 50)));
        }
    }

    update() {  
        Object.keys((<any>this.game.state).players).forEach(playerId => (<any>this.game.state).players[playerId].update());
        // this.filter.update();
    }

    shutdown() {
        Network.removeListener(Network.ALL_PLAYERS);
        Network.removeListener(Network.UPDATE_PLAYER_XY);
        Network.removeListener(Network.PLAYER_DISCONNECTED);
    }
}