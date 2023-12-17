import { MapState } from "../../entity/mapState";
import { MarkType } from "../../type/markType";

/**
 * シミュレートするサービス
 */
export interface SimulateService {
    /**
     * シミュレートするマップの状態
    */
    mapState: MapState;
   /**
    * 自分のマーク
    */
    myMark: MarkType;
    /**
     * 評価値
     */
    evaluatedScore: number;

    /**
     * シミュレートを複製する
     * @returns 複製したシミュレート
     */
    clone(): SimulateService;
    /**
     * シミュレートを評価する
     */
    evaluate(): void;
    /**
     * シミュレートが終了したかどうかを返す
     * @returns シミュレートが終了した場合はtrue
     */
    isDone(): boolean;
}