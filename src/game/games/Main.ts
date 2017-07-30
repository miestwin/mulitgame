import 'p2';
import 'pixi';
import 'phaser';
import * as QRious from 'qrious';
import state from '../state';

import Network from '../network';

export default class Main extends Phaser.State {

    public preload() {
        this.game.stage.backgroundColor = '#FFFFFF';
        this.createQRCode();
    }

    private createQRCode () {
        let that = this;
        let qr = new QRious({
            value: 'https://obscure-hamlet-52147.herokuapp.com/controller/' + state.id,
            size: 300
        });
        qr = qr.toDataURL('image/jpeg');
        let img = new Image();
        console.log(img);
        img.onload = function () {
            that.game.cache.addImage('image-data', img.src, img);
            that.loadQRCode();
        };
        img.src = qr;
    }

    private loadQRCode () {
        this.game.add.sprite(window.innerWidth / 2 - 150, 100, 'image-data');
    }
}