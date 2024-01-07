import { Tilemap } from "../entity/map/tilemap";
import { MarkType } from "../type/markType";
import { OperateType } from "../type/operateType";
import { AssistService } from '../service/map/assistService';
import { OperateManager } from "../entity/operate/operateManager";
import { PlayService } from "../service/map/playService";
import { ViewService } from "../service/map/viewService";
import { ReverseToMarkUtil } from "../util/mark/reverseToMarkUtil";
import { FunctionService } from "../service/map/functionService";
import { TakeBackService } from "../service/map/takeBackService";

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

    constructor() {
        super({ key: 'playScene' });
    }

    init(data: any) {
        this.operateManager = new OperateManager(
            this,
            data.firstOperateType as OperateType,
            data.secondOperateType as OperateType
        );
    }

    preload() {
        this.load.image('mapTiles', 'assets/images/mapTiles.png');
        this.load.spritesheet(ReverseToMarkUtil.get(MarkType.BLACK), 'assets/images/reverseToBlack.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet(ReverseToMarkUtil.get(MarkType.WHITE), 'assets/images/reverseToWhite.png', { frameWidth: 64, frameHeight: 64 })
    }

    create() {
        this.tilemap = new Tilemap(this, 'mapTiles');
        this.assistService = new AssistService(this);
        this.viewService = new ViewService(this);
        this.takeBackService = new TakeBackService();
        this.functionService = new FunctionService(this, this.tilemap, this.assistService, this.operateManager, this.takeBackService);
        this.playService = new PlayService(this, this.operateManager, this.assistService);

        this.assistService.showPutableCoords(this.tilemap, this.operateManager.isManual(MarkType.BLACK));
    }

    update() {
        this.playService.do(this.tilemap, this.takeBackService);
        this.viewService.update(this.tilemap);
        this.functionService.update(this.tilemap, this.takeBackService);
    }
}