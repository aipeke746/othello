import { Tilemap } from "../entity/map/tilemap";
import { MarkType } from "../type/markType";
import { OperateType } from "../type/operateType";
import { AssistService } from '../service/map/assistService';
import { OperateManager } from "../entity/operate/operateManager";
import { PlayService } from "../service/map/playService";
import { ViewService } from "../service/map/viewService";
import { ReverseToMarkUtil } from "../util/mark/reverseToMarkUtil";

/**
 * ゲームのプレイシーン
 */
export class PlayScene extends Phaser.Scene {
    private tilemap: Tilemap;
    private operateManager: OperateManager;
    private assistService: AssistService;
    private viewService: ViewService
    private playService: PlayService;

    constructor() {
        super({ key: 'playScene'});
    }

    init(data: any) {
        this.operateManager = new OperateManager(
            this,
            data.firstOperator as OperateType,
            data.secondOperator as OperateType
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
        this.playService = new PlayService(this, this.operateManager, this.assistService);

        this.assistService.showPutableCoords(this.tilemap, this.operateManager.isManual(MarkType.BLACK));
    }

    update() {
        this.playService.do(this.tilemap);
        this.viewService.update(this.tilemap);
    }
}