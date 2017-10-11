import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';

import Network from '../network';

declare var Victor;

export class GameController extends Phaser.State {

    halfWidth: number;
    halfHeight: number;
    leftTouchID: number;
    leftTouchPos = new Victor(0, 0);
    leftTouchStartPos = new Victor(0, 0);
    leftVector = new Victor(0, 0);
    mouseX;
    mouseY;
    touches: any;
    context;// = this.game.canvas.getContext('2d');
    graphics: Phaser.Graphics;

    preload() {
        console.log("preloader");
        document.getElementById('controller').addEventListener('touchstart', this.onTouchStart);
        document.getElementById('controller').addEventListener('touchmove', this.onTouchMove);
        document.getElementById('controller').addEventListener('touchend', this.onTouchEnd);
    }

    create() {
        this.graphics = this.game.add.graphics(0 ,0);
        console.log('create', this.graphics);
    }

    update() {
        this.game.world.removeAll();
        if (this.touches != null) {
            for (let i = 0; i < this.touches.length; i++) {
                const touch = this.touches[i];
                console.log('update touch', touch);
                if (touch.identifier == this.leftTouchID) {
                    this.graphics.lineStyle(6, 0x66ffff);
                    this.graphics.drawCircle(this.leftTouchStartPos.x, this.leftTouchStartPos.y, 40);
                    this.graphics.lineStyle(2, 0x66ffff);
                    this.graphics.drawCircle(this.leftTouchStartPos.x, this.leftTouchStartPos.y, 60);
                    this.graphics.lineStyle(2, 0x66ffff);
                    this.graphics.drawCircle(this.leftTouchPos.x, this.leftTouchPos.y, 40);
                } else {
                    this.graphics.lineStyle(6, 0xff0000);
                    this.graphics.drawCircle(touch.clientX, touch.clientY, 40);
                }
                console.log('update', this.graphics);
            }
        }
    }

    shutdown() {
        document.getElementById('controller').removeEventListener('touchstart', this.onTouchStart);
        document.getElementById('controller').removeEventListener('touchmove', this.onTouchMove);
        document.getElementById('controller').removeEventListener('touchend', this.onTouchEnd);
    }

    onTouchStart(e: TouchEvent) {
        console.log('start', e);
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            // lewa strona sterowania
            if ((this.leftTouchID < 0) && (touch.clientX < this.halfWidth)) {
                this.leftTouchID = touch.identifier;
                this.leftTouchStartPos = new Victor(touch.clientX, touch.clientY);
                this.leftTouchPos.copy(this.leftTouchStartPos);
                this.leftVector = new Victor(0, 0);
                console.log('start', touch);
                continue;
            } else {
                // prawa strona akcji
            }
        }
        this.touches = e.touches;
    }

    onTouchMove(e: TouchEvent) {
        e.preventDefault();
        console.log('move', e);
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (this.leftTouchID == touch.identifier) {
                this.leftTouchPos = new Victor(touch.clientX, touch.clientY);
                this.leftVector.copy(this.leftTouchPos);
                this.leftVector.subtract(this.leftTouchStartPos);
                break;
            }
        }
    }

    onTouchEnd(e: TouchEvent) {
        this.touches = e.touches;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (this.leftTouchID == touch.identifier) {
                this.leftTouchID = -1;
                this.leftVector = new Victor(0, 0);
                break;
            }
        }
    }
}

// this.game.canvas.addEventListener('touchstart', this.onTouchStart, false);
        // this.game.canvas.addEventListener('touchmove', this.onTouchMove, false);
        // this.game.canvas.addEventListener('touchend', this.onTouchEnd, false);

// this.game.canvas.removeEventListener('touchstart', this.onTouchStart);
        // this.game.canvas.removeEventListener('touchmove', this.onTouchMove, false);
        // this.game.canvas.removeEventListener('touchend', this.onTouchEnd, false);

// private leftButton: Phaser.Sprite;
    // private rightButton: Phaser.Sprite;
    // private jumbButton: Phaser.Sprite;

// this.leftButton = this.game.add.sprite(
        //     this.game.world.centerX / 4 + 50,
        //     this.game.world.centerY,
        //     'left-shaded');
        // this.leftButton.anchor.set(0.5);

        // this.rightButton = this.game.add.sprite(
        //     (this.game.world.centerX / 4) * 3 + 50,
        //     this.game.world.centerY,
        //     'right-shaded');
        // this.rightButton.anchor.set(0.5);

        // this.jumbButton = this.game.add.sprite(
        //     this.game.world.centerX + this.game.world.centerX / 2,
        //     this.game.world.centerY,
        //     'x-shaded');
        // this.jumbButton.anchor.set(0.5);


        // this.context.beginPath();
                // this.context.strokeStyle = "cyan";
                // this.context.lineWidth = 6;
                // this.context.arc(this.leftTouchStartPos.x, this.leftTouchStartPos.y, 40,0,Math.PI*2,true); 
				// this.context.stroke();
				// this.context.beginPath(); 
				// this.context.strokeStyle = "cyan"; 
				// this.context.lineWidth = 2; 
				// this.context.arc(this.leftTouchStartPos.x, this.leftTouchStartPos.y, 60,0,Math.PI*2,true); 
				// this.context.stroke();
				// this.context.beginPath(); 
				// this.context.strokeStyle = "cyan"; 
				// this.context.arc(this.leftTouchPos.x, this.leftTouchPos.y, 40, 0,Math.PI*2, true); 
				// this.context.stroke(); 


// this.context.beginPath();
                // this.context.strokeStyle = "red";
                // this.context.lineWidth = 6;
                // this.context.arc(touch.clientX, touch.clientY, 40, 0, Math.PI*2, true);
                // this.context.stroke();