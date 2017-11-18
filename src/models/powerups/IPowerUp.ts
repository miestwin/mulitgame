import { Player } from '../Player';

export interface IPowerUp {
    powerup(player?: Player, options?: any);
}