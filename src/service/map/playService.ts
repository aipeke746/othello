import { OperateManager } from "../../entity/operateManager";
import { Tilemap } from "../../entity/tilemap";
import { MarkType } from "../../type/markType";
import { AssistService } from "./assistService";

/**
 * ゲームのプレイサービス
 */
export class PlayService {
    /**
     * 操作方法のマネージャー
     */
    private operateManager: OperateManager;
    /**
     * アシストサービス
     */
    private assist: AssistService;

    constructor(operateManager: OperateManager, assist: AssistService) {
        this.operateManager = operateManager;
        this.assist = assist;
    }

    /**
     * プレイする
     * @param tilemap タイルマップ
     */
    public do(tilemap: Tilemap) {
        tilemap.mapState.isDone()
            ? this.finish(tilemap)
            : this.play(tilemap);
    }

    /**
     * 終了処理
     * @param tilemap タイルマップ
     */
    private finish(tilemap: Tilemap) {
        console.log("黒: ", tilemap.mapState.getMarkCount(MarkType.BLACK), " / 白: ", tilemap.mapState.getMarkCount(MarkType.WHITE));
    }

    /**
     * プレイする
     * @param tilemap タイルマップ
     */
    private play(tilemap: Tilemap) {
        const nowMark = tilemap.mapState.getNowTurnMark();
        const operateService = this.operateManager.getOperateService(nowMark);
        const coord = operateService.getCoord(tilemap, nowMark);

        if (coord) {
            tilemap.advance(coord, nowMark);
            const nextMark = tilemap.mapState.getNowTurnMark();
            this.assist.showPutableCoords(tilemap, this.operateManager.isManual(nextMark));
        }
    }
}
