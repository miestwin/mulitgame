import "p2";
import "pixi";
import "phaser";

import { rnd } from "../../utils";
import { States } from "./States";
import { Const } from "../../const";
import Network from "../network";
import { Assets } from "../../assets";
import {
  Player,
  Bullet,
  SingleBullet,
  Comet,
  CometGroup,
  CometExplosion,
  IPowerUp,
  ResetPointsPowerUp,
  UntouchtablePowerUp,
  LittleDoctorPowerUp,
  SplitShotPowerUp,
  PowerUpText,
  ScoreText,
  UfoGroup,
  Ufo,
  Shard,
  ShardGroup,
  Bomb,
  BombGroup
} from "../../models";

declare var Victor;

/**
 * Widok główny
 * @export
 * @class Main
 * @extends {Phaser.State}
 */
export class Main extends Phaser.State {
  /**
   * Kolekcja teł gry
   * @private
   * @type {Phaser.TileSprite[]}
   * @memberof Main
   */
  private tiles: Phaser.TileSprite[] = [];

  /**
   * Objekty należące do menu
   * @private
   * @type {Phaser.Group}
   * @memberof Main
   */
  private menuGroup: Phaser.Group;

  /**
   * Kolekcja graczy do sprawdzania kolizji
   * @private
   * @type {Phaser.Group}
   * @memberof Main
   */
  private players: Phaser.Group;

  /**
   * Kolekcja komet
   * @private
   * @type {Comets}
   * @memberof Main
   */
  private comets: CometGroup;

  /**
   * Kolekcja eksplozji komet
   * @private
   * @type {CometExplosion}
   * @memberof Main
   */
  private explosions: CometExplosion;

  private ufos: UfoGroup;

  private shards: ShardGroup;

  private bombs: BombGroup;

  /**
   * Kolekcja bonusów możliwych do zebrania
   * @private
   * @type {Phaser.Group}
   * @memberof Main
   */
  private powerUps: Phaser.Group;

  /**
   * Wiadomość informująca kiedy zacznie się gra
   * @private
   * @type {Phaser.Text}
   * @memberof Main
   */
  private timerText: Phaser.Text;

  /**
   * Flaga do wystartowania następnego poziomu
   * @private
   * @type {boolean}
   * @memberof Main
   */
  private startNextStage: boolean = false;

  /**
   * Czas do następnego poziomu
   * @private
   * @type {*}
   * @memberof Main
   */
  private nextStageTimeout: any;

  /**
   * Aktualny poziom
   * @private
   * @type {number}
   * @memberof Main
   */
  private currentStage: number = 1;

  /**
   * Flaga informująca o rozpoczęciu gry
   * @private
   * @type {boolean}
   * @memberof Main
   */
  private gameStartedFlag: boolean = false;

  /**
   * Flagi informujące o zakończeniu gry
   * @private
   * @type {boolean}
   * @memberof Main
   */
  private gameEndedFlag: boolean = false;
  private gameEndingFlag: boolean = false;

  /**
   * Czas do końca gry
   * @private
   * @type {*}
   * @memberof Main
   */
  private gameEndTimmeout: any;

  /**
   * Flaga wsakuzjąca czy gra została uruchomiona ponownie
   * @private
   * @type {boolean}
   * @memberof Main
   */
  private gameRestarted: boolean = false;

  init(restart?: boolean) {
    if (restart) {
      this.gameRestarted = true;
    }

    this.startNextStage = false;
    this.gameEndedFlag = false;
    this.gameEndingFlag = false;
    this.gameStartedFlag = false;
    this.currentStage = 1;
  }

  preload() {
    // utworzenie słownika graczy
    (<any>this.game.state).players = {};

    this.players = this.game.add.group();

    // aktualizacja połączonych graczy
    Network.onUpdatePlayersState(player => {
      if (!(<any>this.game.state).players[player.id]) {
        const count = Object.keys((<any>this.game.state).players).length;
        const start = this.game.world.centerY / 2 + 100;
        const offset = this.game.world.centerY / 4 * (count - 1);
        const y = start + offset;
        const newPlayer = new Player(this.game, 50, y, {
          id: player.id,
          socketId: player.socketID,
          avatar: player.character
        });
        (<any>this.game.state).players[player.id] = newPlayer;
        this.players.add(newPlayer);
      }
    });

    // usuń gracza z gry
    Network.onPlayerDisconnected(player => {
      (<any>this.game.state).players = Object.keys(
        (<any>this.game.state).players
      ).reduce((players, nextId) => {
        if ((<any>this.game.state).players[nextId].id == player.id) {
          (<any>this.game.state).players[nextId].shield.destroy();
          (<any>this.game.state).players[nextId].destroy();
          return players;
        }
        players[nextId] = (<any>this.game.state).players[nextId];
        return players;
      }, {});
    });

    Network.onUpdateTimer(sec => {
      this.timerText.setText("The game will start in " + sec);
    });

    Network.onStartGame(() => {
      if (Object.keys((<any>this.game.state).players).length < 1) {
        const message = "No connected players";
        const text = "Try again";
        const action = () => this.game.state.start(States.MAIN);
        this.game.state.start(
          States.MESSAGE,
          true,
          false,
          message,
          text,
          action
        );
      } else {
        this.hideMenu();
        this.gameEndTimmeout = setTimeout(() => {
          this.gameEndedFlag = true;
          this.gameStartedFlag = false;
          this.gameRestarted = false;
          this.gameEndTimmeout = null;
        }, 180000);
      }
    });

    Network.onPlayedUpdateXY((playerId, update) => {
      const player = (<any>this.game.state).players[playerId];
      player.vector = new Victor(update.x, update.y);
    });

    Network.onPlayerFire(playerId => {
      const player = (<any>this.game.state).players[playerId];
      player.fire();
    });

    Network.onNoConnectedPlayers(() => {
      this.game.state.start(
        States.MESSAGE,
        true,
        false,
        "No connected players"
      );
    });

    Network.onPlayAgain(() => {
      if (!this.gameRestarted) {
        Network.removeListener(Network.PLAY_AGAIN);
        this.game.state.restart(true, false, true);
      }
    });

    Network.startTimer();
  }

  create() {
    this.game.physics.setBoundsToWorld();
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.shards = new ShardGroup(this.game);
    this.comets = new CometGroup(this.game);
    this.explosions = new CometExplosion(this.game);
    this.ufos = new UfoGroup(this.game);
    this.bombs = new BombGroup(this.game);

    this.createBackground();
    this.createMenu();

    // debug
    this.game.time.advancedTiming = true;
  }

  update() {
    if (this.gameStartedFlag && !this.gameEndedFlag) {
      this.comets.generate();
      this.ufos.generate();
      this.bombs.generate();
    }

    if (
      this.startNextStage &&
      this.comets.countLiving() === 0 &&
      this.ufos.countLiving() === 0 &&
      this.bombs.countLiving() === 0 &&
      !this.gameEndedFlag
    ) {
      this.startNextStage = false;
      this.players.forEach((player: Player) => {
        player.removePowerups();
      }, this);
      this.createStageInfo();
      this.generatePowerUps();
      this.nextStage();
    }

    if (
      this.gameEndedFlag &&
      this.comets.countLiving() === 0 &&
      !this.gameEndingFlag
    ) {
      this.gameEndingFlag = true;
      this.endGame();
    }

    this.checkCollisions();

    this.game.debug.text(this.time.fps.toString(), 2, 14, "#00ff00");
  }

  shutdown() {
    Network.removeListener(Network.UPDATE_PLAYER_XY);
    Network.removeListener(Network.UPDATE_PLAYER_Z);
    Network.removeListener(Network.PLAYER_DISCONNECTED);
    Network.removeListener(Network.NO_CONNECTED_PLAYERS);
    Network.removeListener(Network.UPDATE_PLAYERS_STATE);
    Network.removeListener(Network.UPDATE_TIMER);
    Network.removeListener(Network.START_GAME);

    // if (this.gameRestarted) {
    //   this.gameRestarted = true;
    //   Network.removeListener(Network.PLAY_AGAIN);
    // }

    if (this.nextStageTimeout) {
      clearTimeout(this.nextStageTimeout);
    }
    if (this.gameEndTimmeout) {
      clearTimeout(this.gameEndTimmeout);
    }
  }

  /**
   * Utworzenie teł gry
   * @private
   * @memberof Main
   */
  private createBackground() {
    for (let i = 1; i <= Const.Nebula.Names.length; i++) {
      const nebula = this.game.add.tileSprite(
        0,
        0,
        this.game.width,
        this.game.height,
        Const.Nebula.Names[i - 1]
      );
      nebula.autoScroll(-100 + -50 * i, 0);
      this.game.world.sendToBack(nebula);
      this.tiles.push(nebula);
    }
    const starfield = this.game.add.tileSprite(
      0,
      0,
      this.game.width,
      this.game.height,
      Const.Stars.getName()
    );
    starfield.autoScroll(-50, 0);
    this.game.world.sendToBack(starfield);
    this.tiles.push(starfield);
  }

  /**
   * Utworzenie menu
   * @private
   * @memberof Main
   */
  private createMenu() {
    this.menuGroup = this.game.add.group();

    // tytuł gry
    const instruction = this.game.add.text(
      this.game.world.centerX,
      100,
      "Scan QRCode and join to the game",
      {
        font: `30px ${Assets.Fonts.Kenvector.getFamily()}`,
        fill: "#ffffff",
        align: "center"
      }
    );
    instruction.anchor.set(0.5);

    // kod qr
    const qr = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      "qrcode"
    );
    qr.anchor.set(0.5);

    this.timerText = this.game.add.text(
      this.game.world.centerX,
      this.game.height - 100,
      "The game will start in ...",
      {
        font: `30px ${Assets.Fonts.Kenvector.getFamily()}`,
        fill: "#ffffff",
        align: "center"
      }
    );
    this.timerText.anchor.set(0.5);

    this.menuGroup.add(instruction);
    this.menuGroup.add(qr);
    this.menuGroup.add(this.timerText);
  }

  /**
   * Usunięcie menu przed rozpoczęciem rozgrywki
   * @private
   * @memberof Main
   */
  private hideMenu() {
    const moveUpTween = this.game.add
      .tween(this.menuGroup.position)
      .to({ y: -this.game.height }, 2000, Phaser.Easing.Linear.None, true);
    moveUpTween.onComplete.add(() => {
      this.game.tweens.remove(moveUpTween);
      this.menuGroup.destroy();
      this.startNextStage = true;
    }, this);
  }

  /**
   * Odliczanie do następnego poziomu
   * @private
   * @memberof Main
   */
  private nextStage() {
    this.nextStageTimeout = setTimeout(() => {
      this.gameStartedFlag = false;
      this.currentStage++;
      this.startNextStage = true;
      this.nextStageTimeout = null;
    }, 60000);
  }

  /**
   * Utworzenie menu poziomu
   * @private
   * @memberof Main
   */
  private createStageInfo() {
    this.menuGroup = this.game.add.group();

    const stage = this.game.add.text(
      this.game.world.centerX,
      50,
      "Stage " + this.currentStage,
      {
        font: `40px ${Assets.Fonts.Kenvector.getFamily()}`,
        fill: "#ffffff",
        align: "center"
      }
    );
    stage.anchor.set(0.5);

    const instruction = this.game.add.text(
      this.game.world.centerX,
      100,
      "Get ready",
      {
        font: `30px ${Assets.Fonts.Kenvector.getFamily()}`,
        fill: "#ffffff",
        align: "center"
      }
    );
    instruction.anchor.set(0.5);

    this.menuGroup.add(stage);
    this.menuGroup.add(instruction);

    const moveUpTween = this.game.add
      .tween(this.menuGroup.position)
      .to(
        { y: -this.game.height },
        1000,
        Phaser.Easing.Linear.None,
        true,
        10000
      );
    moveUpTween.onComplete.add(() => {
      this.game.tweens.remove(moveUpTween);
      this.menuGroup.destroy();
      this.gameStartedFlag = true;
    }, this);
  }

  /**
   * Koniec gry
   * @private
   * @memberof Main
   */
  private endGame() {
    this.shutdown();

    const players = [];
    Object.keys((<any>this.game.state).players).forEach(playerId => {
      players.push((<any>this.game.state).players[playerId]);
    });
    players.sort((a: Player, b: Player) => a.score - b.score);
    players.forEach((player: Player, index: number, arr: Player[]) => {
      player.vector = new Victor(0, 0);
      const count = arr.length;
      const stepY = this.game.world.centerY / count;
      const offsetY = stepY / 2;
      const y = stepY * (index + 1) + offsetY * (count - 1);
      const stepX = 50 * arr.length / count;
      const offsetX = stepX / 2;
      const x = stepX * (index + 1) + offsetX * (count - 1);
      const moveToX = this.game.add
        .tween(player)
        .to({ x: x + 30 }, 1000, Phaser.Easing.Linear.None, true);
      const moveToY = this.game.add
        .tween(player)
        .to({ y: y }, 1000, Phaser.Easing.Linear.None, true);
      moveToX.onComplete.add(() => {
        const text = this.game.add.text(
          x + player.width + 20,
          y,
          player.score.toString(),
          {
            font: `30px ${Assets.Fonts.Kenvector.getFamily()}`,
            fill: "#ffffff",
            align: "center"
          }
        );
        text.anchor.setTo(0, 0.5);
      }, this);
    });

    Network.gameEnd((<any>this.game.state).id, players[players.length - 1].id);

    this.createEndMenu();
  }

  /**
   * Utworzenie manu końcowego
   * @private
   * @memberof Main
   */
  private createEndMenu() {
    const text = this.game.add.text(
      this.game.world.centerX,
      100,
      'If you want play again\npress "START" in your controller',
      {
        font: `30px ${Assets.Fonts.Kenvector.getFamily()}`,
        fill: "#ffffff",
        align: "center"
      }
    );
    text.anchor.setTo(0.5);
  }

  /**
   * Sprawdzanie kolizji
   * @private
   * @memberof Main
   */
  private checkCollisions() {
    this.game.physics.arcade.overlap(
      this.players,
      this.comets,
      this.player_comet_CollisionHandler,
      null,
      this
    );

    this.game.physics.arcade.overlap(
      this.players,
      this.ufos,
      this.player_ufo_CollisionHandler,
      null,
      this
    );

    this.game.physics.arcade.overlap(
      this.players,
      this.shards,
      this.player_shard_CollisionHandler,
      null,
      this
    );

    this.game.physics.arcade.overlap(
      this.players,
      this.powerUps,
      this.player_powerup_CollisionHandler,
      null,
      this
    );

    this.game.physics.arcade.overlap(
      this.players,
      this.powerUps,
      this.player_bomb_CollisionHandler,
      null,
      this
    );

    Object.keys((<any>this.game.state).players).forEach(playerId => {
      const player: Player = (<any>this.game.state).players[playerId];
      this.bullet_comet_CollisionHandler(player);
      this.bullet_ufo_CollisionHandler(player);
      this.bullet_bomb_CollisionHandler(player);

      this.ufos.forEach((ufo: Ufo) => {
        this.game.physics.arcade.overlap(
          player,
          ufo.weapon,
          this.player_bullet_CollisionHandler,
          null,
          this
        );
      }, this);

      this.bombs.forEach((bomb: Bomb) => {
        bomb.chceckDistance(player);
      }, this);
    });
  }

  private player_bullet_CollisionHandler(player: Player, bullet: Bullet) {
    if (player.untouchtable === false) {
      player.score -= bullet.dmg;
      new ScoreText(
        this.game,
        player.x,
        player.y - player.height / 2,
        "-" + bullet.dmg,
        "#FF0000"
      );
      Network.updatePlayerScore(player.id, player.socket, player.score, true);
      bullet.kill();
    }
  }

  private bullet_bomb_CollisionHandler(player: Player) {
    const collisionHandler = (bullet: Bullet, bomb: Bomb) => {
      bomb.health -= bullet.dmg;
      bullet.kill();
      if (bomb.health <= 0) {
        this.explosions.generate(bomb.x, bomb.y);
        player.score += 10;
        new ScoreText(
          this.game,
          player.x,
          player.y - player.height / 2,
          "+10",
          "#00FF00"
        );
        Network.updatePlayerScore(
          player.id,
          player.socket,
          player.score,
          false
        );
        this.shards.generate(bomb.x, bomb.y);
        bomb.kill();
      }
    };

    this.game.physics.arcade.overlap(
      player.weapon,
      this.bombs,
      collisionHandler,
      null,
      this
    );
  }

  private bullet_ufo_CollisionHandler(player: Player) {
    const collisionHandler = (bullet: Bullet, ufo: Ufo) => {
      ufo.health -= bullet.dmg;
      bullet.kill();
      if (ufo.health <= 0) {
        this.explosions.generate(ufo.x, ufo.y);
        player.score += 5;
        new ScoreText(
          this.game,
          player.x,
          player.y - player.height / 2,
          "+5",
          "#00FF00"
        );
        Network.updatePlayerScore(
          player.id,
          player.socket,
          player.score,
          false
        );
        this.shards.generate(ufo.x, ufo.y);
        ufo.kill();
      }
    };

    this.game.physics.arcade.overlap(
      player.weapon,
      this.ufos,
      collisionHandler,
      null,
      this
    );
  }

  private bullet_comet_CollisionHandler(player: Player) {
    const collisionHandler = (bullet: Bullet, comet: Comet) => {
      comet.health -= bullet.dmg;
      bullet.kill();
      if (comet.health <= 0) {
        this.explosions.generate(comet.x, comet.y);
        player.score += 20;
        new ScoreText(
          this.game,
          player.x,
          player.y - player.height / 2,
          "+20",
          "#00FF00"
        );
        Network.updatePlayerScore(
          player.id,
          player.socket,
          player.score,
          false
        );
        this.generateRandomPowerUps(comet.x, comet.y);
        comet.kill();
      }
    };

    this.game.physics.arcade.overlap(
      player.weapon,
      this.comets,
      collisionHandler,
      null,
      this
    );
  }

  /**
   * Kolizja gracza z kometą
   * @private
   * @param {Player} player 
   * @param {Comet} comet 
   * @memberof Main
   */
  private player_comet_CollisionHandler(player: Player, comet: Comet) {
    if (player.untouchtable === false) {
      player.score -= 10;
      new ScoreText(
        this.game,
        player.x,
        player.y - player.height / 2,
        "-10",
        "#FF0000"
      );
      this.explosions.generate(comet.x, comet.y);
      comet.kill();
      Network.updatePlayerScore(player.id, player.socket, player.score, true);
    }
  }

  private player_ufo_CollisionHandler(player: Player, ufo: Ufo) {
    if (player.untouchtable === false) {
      player.score -= 10;
      new ScoreText(
        this.game,
        player.x,
        player.y - player.height / 2,
        "-10",
        "#FF0000"
      );
      this.explosions.generate(ufo.x, ufo.y);
      ufo.kill();
      Network.updatePlayerScore(player.id, player.socket, player.score, true);
    }
  }

  private player_shard_CollisionHandler(player: Player, shard: Shard) {
    player.score += shard.points;
    new ScoreText(
      this.game,
      player.x,
      player.y - player.height / 2,
      "+" + shard.points.toString(),
      "#00FF00"
    );
    shard.kill();
    Network.updatePlayerScore(player.id, player.socket, player.score, false);
  }

  private player_bomb_CollisionHandler(player: Player, bomb: Bomb) {
    if (player.untouchtable === false) {
      player.score -= 30;
      new ScoreText(
        this.game,
        player.x,
        player.y - player.height / 2,
        "-30",
        "#FF0000"
      );
      this.explosions.generate(bomb.x, bomb.y);
      bomb.kill();
      Network.updatePlayerScore(player.id, player.socket, player.score, true);
    }
  }

  /**
   * Kolizja gracza ze wzmocnieniem
   * @private
   * @param {Player} player 
   * @param {IPowerUp} powerup 
   * @memberof Main
   */
  private player_powerup_CollisionHandler(player: Player, powerup: IPowerUp) {
    powerup.powerup(player);
    new PowerUpText(
      this.game,
      player.x,
      player.y - player.height / 2,
      powerup.name,
      "#FFFFFF"
    );
    player.powerups.push(powerup);
  }

  private generateRandomPowerUps(x: number, y: number) {
    const pu = rnd.integerInRange(1, 3);
    const chance = rnd.integerInRange(1, 10);
    if (chance !== 1) {
      return;
    }
    switch (pu) {
      case 1:
        this.powerUps.add(new SplitShotPowerUp(this.game, x, y));
        break;
      case 2:
        this.powerUps.add(new LittleDoctorPowerUp(this.game, x, y));
        break;
      case 3:
        this.powerUps.add(new UntouchtablePowerUp(this.game, x, y));
    }
  }

  /**
   * Generowanie wzmocnień
   * @private
   * @memberof Main
   */
  private generatePowerUps() {
    if (this.powerUps) {
      this.powerUps.destroy();
    }
    this.powerUps = this.game.add.group();

    if (this.currentStage !== 1) {
      this.powerUps.add(
        new ResetPointsPowerUp(
          this.game,
          rnd.integerInRange(400, this.game.width - 100),
          rnd.integerInRange(100, this.game.height - 100),
          player => {
            Network.updatePlayerScore(
              player.id,
              player.socket,
              player.score,
              false
            );
          }
        )
      );
    }
  }
}
