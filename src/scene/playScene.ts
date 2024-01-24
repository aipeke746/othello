import { Tilemap } from '../entity/map/tilemap';
import { MarkType } from '../type/markType';
import { OperateType } from '../type/operateType';
import { AssistService } from '../service/map/assistService';
import { OperateManager } from '../entity/operate/operateManager';
import { PlayService } from '../service/map/playService';
import { ViewService } from '../service/map/viewService';
import { ReverseToMarkUtil } from '../util/mark/reverseToMarkUtil';
import { FunctionService } from '../service/map/functionService';
import { TakeBackService } from '../service/map/takeBackService';
import { Param } from '../static/param';
import { Animation } from '../static/animation';

/**
 * ゲームのプレイシーン
 */
export class PlayScene extends Phaser.Scene {
    private tilemap: Tilemap;
    private operateManager: OperateManager;
    private assistService: AssistService;
    private viewService: ViewService;
    private takeBackService: TakeBackService;
    private functionService: FunctionService;
    private playService: PlayService;
    private music: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: 'playScene' });
    }

    init(data: any): void {
        this.operateManager = new OperateManager(
            this,
            data.firstOperateType as OperateType,
            data.secondOperateType as OperateType
        );
    }

    preload(): void {
        this.load.image('mapTiles', 'asset/image/mapTiles.png');
        this.load.spritesheet(ReverseToMarkUtil.get(MarkType.BLACK), 'asset/image/reverseToBlack.png', {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet(ReverseToMarkUtil.get(MarkType.WHITE), 'asset/image/reverseToWhite.png', {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.audio('putMarkSound', 'asset/sound/putMark.mp3');
        this.load.audio('reverseMarkSound', 'asset/sound/reverseMark.mp3');
        this.load.audio('music', 'asset/music/Digital_Ghosts-Unicorn_Heads.mp3');
    }

    create(): void {
        Animation.createMarkReverseAnim(this);
        this.music = this.sound.add('music', { volume: 0.5, loop: true });
        if (Param.PLAY_MUSIC) {
            this.music.play();
        }

        this.tilemap = new Tilemap(this, 'mapTiles');
        this.assistService = new AssistService(this);
        this.viewService = new ViewService(this);
        this.takeBackService = new TakeBackService();
        this.functionService = new FunctionService(
            this,
            this.tilemap,
            this.assistService,
            this.operateManager,
            this.takeBackService,
            this.music
        );
        this.playService = new PlayService(this, this.operateManager, this.assistService);

        this.assistService.showPutableCoords(this.tilemap, this.operateManager.isManual(MarkType.BLACK));
    }

    update(): void {
        this.playService.do(this.tilemap, this.takeBackService);
        this.viewService.update(this.tilemap);
        this.functionService.update(this.tilemap, this.takeBackService);
    }
}
