import { MapState } from "../entity/mapState";
import { Tilemap } from "../entity/tilemap";
import { SimulateService } from "../service/simulate/simulateService";
import { MarkType } from "../type/markType";
import { Coord } from "../vo/coord";
import { PutMarkUtil } from "./putMarkUtil";
import { ReverseMarkUtil } from "./reverseMarkUtil";

/**
 * ゲームの進行を行うユーティリティクラス
 */
export class GameUtil {
    /**
     * ターンを進める
     * @param tilemap タイルマップ
     * @param coord 座標
     * @param mark マーク
     */
    public static advance(tilemap: Tilemap, mark: MarkType, coord: Coord) {
        this.advanceMap(tilemap.mapState, coord, mark);
        tilemap.update();
    }

    /**
     * シミュレートでターンを進める
     * @param simulate シミュレート
     * @param coord 座標
     * @param mark マーク
     */
    public static simulateAdvance(simulate: SimulateService, mark: MarkType, coord: Coord) {
        this.advanceMap(simulate.mapState, coord, mark);
    }

    /**
     * マークをひっくり返してターンを進める
     * @param mapState マップの状態
     * @param coord 座標
     * @param mark マーク
     */
    private static advanceMap(mapState: MapState, coord: Coord, mark: MarkType) {
        ReverseMarkUtil.reverse(mapState, coord, mark);
        mapState.nextTurn();
        if (!PutMarkUtil.isPutable(mapState)) {
            mapState.nextTurn();
        }
    }
}