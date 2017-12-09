import { Player } from '../Player';

export interface IPowerUp {
    player: Player;
    powerup(player: Player, options?: any): void;
    remove(): void;
}