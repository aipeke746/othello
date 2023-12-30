import { MapState } from "../entity/mapState";
import { WeightMap } from "../service/simulate/weight/weightMap";
import { MarkType } from "../type/markType";
import { Coord } from "../vo/coord";
import { MarkTypeUtil } from "./markTypeUtil";

/**
 * 評価値を計算するクラス
 */
export class EvaluatedScoreUtil {
    /**
     * 着手可能評価値
     */
    public static readonly PUTABLE_WEIGHT: number = 20;

    /**
     * 置かれたマークの評価値を取得する
     * @param mapState マップの状態
     * @param mark マーク
     * @returns 評価値
     */
    public static getByPutCoords(mapState: MapState, mark: MarkType): number {
        const coords: Coord[] = mapState.getMarkCoords(mark);
        return coords.reduce(
            (score, coord) => score + WeightMap.WEIGHT_MAP[coord.y][coord.x], 0
        );
    }

    /**
     * 着手可能評価値を取得する
     * @param mapState マップの状態
     * @param mark マーク
     * @returns 評価値
     */
    public static getByPutableCoords(mapState: MapState, mark: MarkType): number {
        const coords: Coord[] = mapState.getPutableCoords(mark);
        return coords.reduce(
            (score, coord) => score + WeightMap.WEIGHT_MAP[coord.y][coord.x] + EvaluatedScoreUtil.PUTABLE_WEIGHT, 0
        );
    }

    //　確定石
    // public static getByFixedCoords(mapState: MapState, mark: MarkType): number {
    //     const coords: Coord[] = mapState.getFixedCoords(mark);
    //     return coords.reduce(
    //         (score, coord) => score + WeightMap.WEIGHT_MAP[coord.y][coord.x], 0
    //     );
    // }

    /**
     * 勝敗が決まった時の評価値を取得する
     * @param mapState マップの状態
     * @param mark マーク
     * @returns 評価値
     */
    public static getByFinish(mapState: MapState, mark: MarkType): number {
        if (!mapState.isDone()) {
            return 0;
        }

        const myMarkCount = mapState.getMarkCount(mark);
        const opponentMarkCount = mapState.getMarkCount(MarkTypeUtil.getOpponent(mark));
        return myMarkCount - opponentMarkCount > 0
            ? 100
            : 100;
    }
}