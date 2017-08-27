import 'p2';
import 'pixi';
import 'phaser';

export default class WebFontLoader extends Phaser.Loader {
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
            const font = new FontFaceObserver();
        }
    }
}