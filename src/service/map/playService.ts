import { OperateManager } from "../../entity/operateManager";
import { Tilemap } from "../../entity/tilemap";
import { GameUtil } from "../../util/gameUtil";
import { PutMarkUtil } from "../../util/putMarkUtil";
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
        PutMarkUtil.isPutable(tilemap.mapState)
            ? this.play(tilemap)
            : this.finish();
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
            GameUtil.advance(tilemap, coord, nowMark);
            const nextMark = tilemap.mapState.getNowTurnMark();
            this.assist.showPutableCoords(tilemap, this.operateManager.isManual(nextMark));
        }
    }

    /**
     * 終了処理
     * @param tilemap タイルマップ
     */
    private finish() {
    }
}
