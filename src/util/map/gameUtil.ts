import { MapState } from '../../entity/map/mapState';
import type { Tilemap } from '../../entity/map/tilemap';
import type { SimulateService } from '../../service/simulate/simulateService';
import type { MarkType } from '../../type/markType';
import type { Coord } from '../../vo/coord';
import { PutMarkUtil } from './putMarkUtil';
import { ReverseMarkUtil } from './reverseMarkUtil';

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
    public static advance(tilemap: Tilemap, mark: MarkType, coord: Coord): void {
        this.advanceMap(tilemap.mapState, coord, mark);
        tilemap.update();
    }

    /**
     * シミュレーションでターンを進める
     * @param simulate シミュレート
     * @param coord 座標
     * @param mark マーク
     */
    public static simulateAdvance(
        simulate: SimulateService,
        mark: MarkType,
        coord: Coord
    ): void {
        this.advanceMap(simulate.mapState, coord, mark);
    }

    /**
     * マークをひっくり返してターンを進める
     * 次のターンのマークがセットすることができない場合はターンをスキップする
     * @param mapState マップの状態
     * @param coord 座標
     * @param mark マーク
     */
    private static advanceMap(
        mapState: MapState,
        coord: Coord,
        mark: MarkType
    ): void {
        ReverseMarkUtil.reverse(mapState, coord, mark);
        mapState.nextTurn();
        if (!PutMarkUtil.isPutableMark(mapState, mapState.getNowTurnMark())) {
            mapState.nextTurn();
        }
    }
}
