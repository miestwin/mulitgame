import 'p2';
import 'pixi';
import 'phaser';
import * as FontFaceObserver from 'fontfaceobserver';

export default class CustomLoader extends Phaser.Loader {
    constructor(game) {
        super(game);
    }

    public webfont(key, fontName, overwrite) {
        if (typeof overwrite === 'undefined') {
            overwrite = false;
        }
        this.addToFileList('webfont', key, fontName);
        return this;
    }

    public loadFile(file) {
        super.loadFile(file);
        if (file.type === 'webfont') {
            const font = new FontFaceObserver(file.url);
            font.load(null, 10000).then(() => {
                this.asyncComplete(file);
            }, () => {
                this.asyncComplete(file, 'Error loading font ' + file.url);
            });
        }
    }
}