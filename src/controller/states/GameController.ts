import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';

import Network from '../network';

declare var Victor;

export class GameController extends Phaser.State {

    private logEvents = false;
    private tpCache = new Array();
    
    leftTouchID: number;
    leftTouchPos = new Victor(0, 0);
    leftTouchStartPos = new Victor(0, 0);
    leftVector = new Victor(0, 0);

    touches: TouchList;
    graphics: Phaser.Graphics;

    preload() {
        console.log("preloader");
        document.getElementById('controller').addEventListener('touchstart', this.onTouchStart.bind(this));
        document.getElementById('controller').addEventListener('touchmove', this.onTouchMove.bind(this));
        document.getElementById('controller').addEventListener('touchend', this.onTouchEnd.bind(this));
        // document.getElementById('controller').addEventListener('touchcancel', this.onTouchEnd);
    }

    create() {
        this.graphics = this.game.add.graphics(0 ,0);
    }

    update() {
        this.graphics.clear();
        if (this.touches) {
            for (let i = 0; i < this.touches.length; i++) {
                const touch = this.touches[i];
                if (touch.identifier == this.leftTouchID) {
                    this.graphics.lineStyle(6, 0x66ffff);
                    this.graphics.drawCircle(this.leftTouchStartPos.x, this.leftTouchStartPos.y, 60);
                    this.graphics.lineStyle(2, 0x66ffff);
                    this.graphics.drawCircle(this.leftTouchStartPos.x, this.leftTouchStartPos.y, 80);
                    this.graphics.lineStyle(2, 0x66ffff);
                    this.graphics.drawCircle(this.leftTouchPos.x, this.leftTouchPos.y, 60);
                } else {
                    this.graphics.lineStyle(2, 0xff0000);
                    this.graphics.drawCircle(touch.clientX, touch.clientY, 80);
                }
            }
        }
    }

    shutdown() {
        document.getElementById('controller').removeEventListener('touchstart', this.onTouchStart.bind(this));
        document.getElementById('controller').removeEventListener('touchmove', this.onTouchMove.bind(this));
        document.getElementById('controller').removeEventListener('touchend', this.onTouchEnd.bind(this));
        // document.getElementById('controller').removeEventListener('touchcancel', this.onTouchEnd);
    }

    onTouchStart(e: TouchEvent) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            // lewa strona sterowania
            if (touch.clientX < this.game.world.centerX) {
                this.leftTouchID = touch.identifier;
                this.leftTouchStartPos = new Victor(touch.clientX, touch.clientY);
                this.leftTouchPos.copy(this.leftTouchStartPos);
                this.leftVector = new Victor(0, 0);
                continue;
            }
        }
        this.touches = e.touches;
    }

    onTouchMove(e: TouchEvent) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier == this.leftTouchID) {
                this.leftTouchPos = new Victor(touch.clientX, touch.clientY);
                if (Math.abs(this.leftTouchStartPos.distance(this.leftTouchPos)) > 70) {
                    this.leftTouchPos.subtract(this.leftTouchStartPos);
                    this.leftTouchPos.normalize();
                    this.leftTouchPos.multiply(new Victor(70, 70));
                    this.leftTouchPos.add(this.leftTouchStartPos);
                } 
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
            if (touch.identifier == this.leftTouchID) {
                this.leftTouchID = -1;
                this.leftVector = new Victor(0, 0);
                break;
            }
        }
    }
}



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