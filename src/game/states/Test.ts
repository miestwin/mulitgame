import 'p2';
import 'pixi';
import 'phaser';

import { pointStars } from '../../engine';

class Uniforms {
    source: any
}

export class Test extends Phaser.State {
    filter: Phaser.Filter;
    sprite;
    count = 0;

    preload() {
        this.game.load.shader('test', '../assets/shaders/test.frag');
    }

    create() {
        var uniforms = new Uniforms();
        uniforms.source = { type: '1f', value: pointStars(this.game, 0.0, 0.125)};
        this.filter = new Phaser.Filter(this.game, uniforms, this.game.cache.getShader('test'));
        this.filter.addToWorld(0, 0, this.game.width, this.game.height);

        // this.filter = new Phaser.Filter(this.game, null, fragmentSrc);
        // this.filter.setResolution(this.game.width, this.game.height);

        // this.sprite = this.game.add.sprite(this.game.width, this.game.height);

        // this.sprite.filters = [this.filter];
        // this.scene = new Scene(document.getElementById('testStar'));
        // this.scene.render();
    }

    update() {
        // this.count += 1;
        // this.filter.uniforms.time.value = this.count;
        // this.filter.update();
    }
}