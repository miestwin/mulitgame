import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';

import Network from '../network';

import { Player } from '../../models';

/**
 * Start rozgrywki
 * @export
 * @class Boot
 * @extends {Phaser.State}
 */
export class StartGame extends Phaser.State {

    private cursor;
    private platform = {
        step: 77,
        scale: 0.3
    };

    private platforms: Phaser.Group;
    private ground: Phaser.Group;

    preload() {
        Network.onGetAllPlayers((players) => {
            Object.keys(players).forEach((playerId, index, playersId) => {
                const count = playersId.length;
                const step = this.game.world.centerY / count;
                const offset = step / 2;
                const y = step * (index + 1) + (offset * (count - 1));
                (<any>this.game.state).players[playerId] = 
                    new Player(this.game, 50, y, { id: players[playerId].id, socketId: players[playerId].socketID, avatar: players[playerId].character });
                (<any>this.game.state).players[playerId].angle += 90;
            });
        });

        Network.getAllPlayers();
    }

    create() {
        // var message = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'GAME START NOW', { font: '35px Kenvector Future', fill: '#ffffff', align: 'center' });
        // message.anchor.set(0.5);

        this.game.world.setBounds(0, 0, 50000, this.game.height);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }

    update() {  
        
    }

    shutdown() {}
}