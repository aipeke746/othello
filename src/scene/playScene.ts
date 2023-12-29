import { Tilemap } from "../entity/tilemap";
import { OperateService } from "../service/operate/operateService";
import { MarkType } from "../type/markType";
import { OperateType } from "../type/operateType";
import { AssistService } from '../service/map/assistService';
import { OperateManager } from "../entity/operateManager";

/**
 * ゲームのプレイシーン
 */
export class PlayScene extends Phaser.Scene {
    private tilemap: Tilemap;
    private operateManager: OperateManager;
    private assist: AssistService = new AssistService(this);

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
        this.assist.showPutableCoords(this.tilemap, this.operateManager.isManual(MarkType.BLACK));
    }

    update() {
        if (this.tilemap.mapState.isDone()) {
            console.log("黒: ", this.tilemap.mapState.getMarkCount(MarkType.BLACK), " / 白: ", this.tilemap.mapState.getMarkCount(MarkType.WHITE));
        } else {
            this.play(this.tilemap, this.operateManager);
        }
    }

    /**
     * プレイを実行する
     * @param tilemap タイルマップ
     * @param turnMap ターンマップ
     */
    private play(tilemap: Tilemap, operateManager: OperateManager) {
        const nowMark: MarkType = tilemap.mapState.getNowTurnMark();
        const operateService: OperateService = operateManager.getOperateService(nowMark);
        const coord = operateService.getCoord(tilemap, nowMark);

        if (coord) {
            tilemap.advance(coord, nowMark);
            const nextMark: MarkType = tilemap.mapState.getNowTurnMark();
            this.assist.showPutableCoords(tilemap, operateManager.isManual(nextMark));
        }
    }
}