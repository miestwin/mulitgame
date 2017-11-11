import 'p2';
import 'pixi';
import 'phaser';

export function comet(game: Phaser.Game, width: number, height: number, rc: number, key: string) {
    const x = height / 2;
    const y = height / 2;
    const rt = height / 2;
    const canvas = document.createElement('canvas');
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext('2d');
    
    var grd = ctx.createLinearGradient(0,0,width,0);
    grd.addColorStop(0,'rgba(255, 255, 255, 0.85)');
    grd.addColorStop(1,'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grd;
    ctx.arc(x, y, rt, 90, Math.PI, true);
    ctx.moveTo(x, height);
    ctx.lineTo(width, height);
    ctx.lineTo(width, 0);
    ctx.lineTo(x, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#332200';
    ctx.arc(x, y, rc, 0, Math.PI * 2, true);
    ctx.fill();

    let img = new Image();
    img.onload = () => {
        game.cache.addImage(key, img.src, img);
    };
    img.src = canvas.toDataURL('image/png');
}