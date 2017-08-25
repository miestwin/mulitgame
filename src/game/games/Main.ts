import 'p2';
import 'pixi';
import 'phaser';
import  * as _ from 'lodash';
import * as QRious from 'qrious';
import state from '../state';
import config from '../../config';
import Network from '../network';

export default class Main extends Phaser.State {
    private playersConnected: Array<{ text: Phaser.Text, sprite: Phaser.Sprite }> = [];

    public preload() {
        this.game.load.image('LUMBER', '../assets/spritesheets/lumber-test.png');
        this.game.stage.disableVisibilityChange = true;
        this.game.stage.backgroundColor = '#000000';
        this.createQRCode();
    }

    public create() {
        Network.updatePlayersState((players) => {
            state.players = _.assign({}, players);
            this.updateConnectedPlayers();
        })

        Network.playerDisconnected((player) => {
            const remainderPlayers = Object.keys(state.players).reduce((remainder,playerID) => {
                if (playerID != player.id) {
                    remainder[playerID] = state.players[playerID];
                }
                return remainder;
            }, {});
            state.players = _.assign({}, remainderPlayers);
            this.updateConnectedPlayers();
        });
    }

    private createQRCode () {
        let that = this;
        let qr = new QRious({
            value: config.url + '/controller/' + state.id,
            background: '#ffffff',
            padding: 20,
            size: 340
        });
        qr = qr.toDataURL('image/jpeg');
        let img = new Image();
        img.onload = function () {
            that.game.cache.addImage('image-data', img.src, img);
            that.loadQRCode();
        };
        img.title = state.id;
        img.src = qr;
    }

    private loadQRCode () {
        var qr = this.game.add.sprite(this.game.world.centerX, 210, 'image-data');
        qr.anchor.set(0.5);
        var text = this.game.add.text(this.game.world.centerX, 400, state.id, { font: '18px Arial', fill: '#ffffff', align: 'center'});
        text.anchor.set(0.5);
    }

    private updateConnectedPlayers() {
        this.removePlayersConnected();
        let i = 200;
        Object.keys(state.players).forEach((player) => {
            let text = this.game.add.text(this.game.world.centerX - i, 480, `Player 1 connected`, { font: '20px Arial', fill: state.players[player].theme, align: 'center'})
            text.anchor.set(0.5);
            let sprite = this.game.add.sprite(this.game.world.centerX - i, 550, 'LUMBER');
            sprite.anchor.set(0.5);
            sprite.scale.set(0.5);
            this.playersConnected.push({ text, sprite });
            i -= 100;
        });
    }

    private removePlayersConnected() {
        this.playersConnected.forEach(player => { 
            player.text.destroy(); 
            player.sprite.destroy();
        });
        this.playersConnected = [];
    }
}