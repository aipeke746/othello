import { MapState } from "../../entity/mapState";
import { MarkType } from "../../type/markType";
import { PutMarkUtil } from "../../util/putMarkUtil";
import { SimulateParam } from "./param/simulateParam";

/**
 * ミニマックス法でシミュレートするクラス
 */
export abstract class SimulateService {
    /**
     * シミュレートするマップの状態
    */
    public mapState: MapState;
   /**
    * 自分のマーク
    */
    public myMark: MarkType;
    /**
     * 探索パラメータ
     */
    public param: SimulateParam;

    constructor(mapState: MapState, myMark: MarkType, param: SimulateParam) {
        this.mapState = mapState;
        this.myMark = myMark;
        this.param = param;
    }

    /**
     * シミュレーションを複製する
     * @returns 
     */
    public abstract clone(): SimulateService;

    /**
     * 評価値を返す
     * @returns 評価値
     */
    public abstract evaluate(): number;

    /**
     * ゲーム（シミュレーション）が終了したかどうかを返す
     * @returns ゲーム（シミュレーション）が終了した場合はtrue
     */
    public isDone(): boolean {
        return !PutMarkUtil.isPutable(this.mapState);
    }

    /**
     * 自分のターンかどうかを返す
     * @returns 自分のターンの場合はtrue
     */
    public isMyTurn(): boolean {
        return this.mapState.getNowTurnMark() === this.myMark;
    }

    /**
     * アルファカットの処理を行い、アルファカットが発生するかどうかを返す
     * @param minScore 最小スコア
     * @returns アルファカットが発生する場合はtrue
     */
    public alphaCut(minScore: number): boolean {
        this.param.beta = Math.min(this.param.beta, minScore)
        return this.param.alpha >= this.param.beta
    }

    /**
     * ベータカットの処理を行い、ベータカットが発生するかどうかを返す
     * @param maxScore 最大スコア
     * @returns ベータカットが発生する場合はtrue
     */
    public betaCut(maxScore: number): boolean {
        this.param.alpha = Math.max(this.param.alpha, maxScore)
        return this.param.alpha >= this.param.beta
    }
}