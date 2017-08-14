import 'p2';
import 'pixi';
import 'phaser';
import  * as _ from 'lodash';
import * as QRious from 'qrious';
import state from '../state';
import config from '../../config';
import Network from '../network';

export default class Main extends Phaser.State {
    private playersConnected: Array<Phaser.Text> = [];

    public preload() {
        this.game.stage.disableVisibilityChange = true;
        this.game.stage.backgroundColor = '#FFFFFF';
        this.createQRCode();
    }

    public create() {
        Network.updatePlayersState((players) => {
            state.players = _.assign({}, state.players, players);
            this.updateConnectedPlayers();
        })
    }

    private createQRCode () {
        let that = this;
        let qr = new QRious({
            value: config.url + '/controller/' + state.id,
            size: 300
        });
        qr = qr.toDataURL('image/jpeg');
        let img = new Image();
        img.onload = function () {
            that.game.cache.addImage('image-data', img.src, img);
            that.loadQRCode();
        };
        img.src = qr;
    }

    private loadQRCode () {
        this.game.add.sprite(window.innerWidth / 2 - 150, 50, 'image-data');
    }

    private updateConnectedPlayers() {
        this.removePlayersConnected();
        let i = 10;
        Object.keys(state.players).forEach((player) => {
            let text = this.game.add.text(this.game.world.centerX, 450 + i, `Player 1 connected`, { font: '20px Arial', fill: state.players[player].theme, align: 'center'})
            this.playersConnected.push();
            i += 30;
        });
    }

    private removePlayersConnected() {
        this.playersConnected.forEach(text => text.destroy());
        this.playersConnected = [];
    }
}