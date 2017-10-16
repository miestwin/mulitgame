import 'p2';
import 'pixi';
import 'phaser';

import * as pointStars from '../../engine/starfield/point-stars';

class Uniforms {
    resolution: any;
    alpha: any;
    shift: any;
    time: any;
    speed: any;
}

export class Test extends Phaser.State {
    filter: Phaser.Filter;
    sprite;
    count = 0;

    preload() {
        this.game.load.shader('bacteria', '../assets/shaders/starfield-02.frag');
    }

    create() {
        // var uniforms = new Uniforms();
        // uniforms.resolution = { type: 'v2', value: { x: this.game.width, y: this.game.height}};
        // uniforms.alpha = { type: '1f', value: 1.0};
        // uniforms.shift = { type: '1f', value: 1.6};
        // uniforms.time = {type: '1f',value: 0};
        // uniforms.speed = {type: 'v2', value: {x: 0.7, y: 0.4}};
        this.filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('bacteria'));
        this.filter.addToWorld(0, 0, this.game.width, this.game.height);

        // this.filter = new Phaser.Filter(this.game, null, fragmentSrc);
        // this.filter.setResolution(this.game.width, this.game.height);

        // this.sprite = this.game.add.sprite(this.game.width, this.game.height);

        // this.sprite.filters = [this.filter];
    }

    update() {
        //this.count += 1;
        //this.filter.uniforms.time.value = this.count;
        this.filter.update();
    }
}