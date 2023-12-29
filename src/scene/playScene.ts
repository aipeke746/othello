import { Tilemap } from "../entity/tilemap";
import { MarkType } from "../type/markType";
import { OperateType } from "../type/operateType";
import { AssistService } from '../service/map/assistService';
import { OperateManager } from "../entity/operateManager";
import { PlayService } from "../service/map/playService";
import { ScoreService } from "../service/map/scoreService";

/**
 * ゲームのプレイシーン
 */
export class PlayScene extends Phaser.Scene {
    private tilemap: Tilemap;
    private operateManager: OperateManager;
    private assistService: AssistService;
    private scoreService: ScoreService
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
    }

    create() {
        this.tilemap = new Tilemap(this, 'mapTiles');
        this.assistService = new AssistService(this);
        this.scoreService = new ScoreService(this);
        this.playService = new PlayService(this.operateManager, this.assistService);

        this.assistService.showPutableCoords(this.tilemap, this.operateManager.isManual(MarkType.BLACK));
    }

    update() {
        this.playService.do(this.tilemap);
        this.scoreService.update(this.tilemap);
    }
}