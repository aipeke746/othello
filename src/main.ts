import Phaser from 'phaser';
import { PlayScene } from './scene/playScene';
import { MapState } from './entity/mapState';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: MapState.LENGTH * MapState.SIZE,
    height: MapState.LENGTH * MapState.SIZE,
    parent: 'app',
    physics: {
        default: 'arcade',
        arcade: {
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [PlayScene],
};

new Phaser.Game(config);
