import 'p2';
import 'pixi';
import 'phaser';
import  * as _ from 'lodash';

import state from '../state';
import Network from '../network';


export class MainMenu extends Phaser.State {
    private y: number = 0;


    public preload() {
        this.game.stage.backgroundColor = '#000000';

        Network.updatePlayersState((players) => {
            //state.players = _.assign({}, players);
        })

        Network.playerDisconnected((player) => {
            // const remainderPlayers = Object.keys(state.players).reduce((remainder,playerID) => {
            //     if (playerID != player.id) {
            //         remainder[playerID] = state.players[playerID];
            //     }
            //     return remainder;
            // }, {});
            // state.players = _.assign({}, remainderPlayers);
        });
    }

    public create() {
        // show game title
        const text = this.game.add.text(
            this.game.world.centerX, 40,
            'SUPER GAME TITLE',
            { 
                font: '35px Kenvector Future',
                fill: '#ffffff',
                align: 'center'
            });
        text.anchor.set(0.5, 0);

        // show qrcode
        const qr = this.game.add.sprite(this.game.world.centerX, 100, 'qrcode');
        qr.anchor.set(0.5, 0);
        // show game id
        var gameIdText = this.game.add.text(this.game.world.centerX, 405,
            state.id,
            { 
                font: '15px Kenvector Future',
                fill: '#ffffff',
                align: 'center'
            });
        gameIdText.anchor.set(0.5, 0);
    }
}