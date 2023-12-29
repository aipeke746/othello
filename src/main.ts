import Phaser from 'phaser';
import { PlayScene } from './scene/playScene';
import { MapState } from './entity/mapState';
import { TitleScene } from './scene/titleScene';
import { Param } from './param';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: MapState.LENGTH * MapState.SIZE + Param.TILE_MARGIN * 2,
    height: MapState.LENGTH * MapState.SIZE + Param.TILE_MARGIN * 2 + Param.BOTTOM_TILE_MARGIN,
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
    scene: [TitleScene, PlayScene],
};

new Phaser.Game(config);
