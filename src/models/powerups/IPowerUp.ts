import { Player } from '../Player';

export interface IPowerUp {
    readonly name: string;
    player: Player;
    powerup(player: Player, options?: any): void;
    remove(): void;
}