import 'p2';
import 'pixi';
import 'phaser';
import * as FontFaceObserver from 'fontfaceobserver';

/**
 * Własna impementacja Loadera zasobów
 * @export
 * @class CustomLoader
 * @extends {Phaser.Loader}
 */
export class CustomLoader extends Phaser.Loader {
    constructor(game) {
        super(game);
    }

    /**
     * Ładuje czcionke
     * Wymagane jest wstawienie czcionki w głównym pliku css
     * @param {any} key 
     * @param {any} fontName 
     * @param {any} overwrite 
     * @returns 
     * @memberof CustomLoader
     */
    public webfont(key, fontName, overwrite) {
        if (typeof overwrite === 'undefined') {
            overwrite = false;
        }
        this.addToFileList('webfont', key, fontName);
        return this;
    }

    /**
     * Ładowanie pliku
     * @extends
     * @param {any} file 
     * @memberof CustomLoader
     */
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