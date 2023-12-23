import { MapState } from "../../entity/mapState";
import { MarkType } from "../../type/markType";
import { MarkTypeUtil } from "../../util/markTypeUtil";
import { SimulateParam } from "./simulateParam";

/**
 * ミニマックス法でシミュレートするクラス
 */
export class SimulateService {
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
    public clone(): SimulateService {
        return new SimulateService(this.mapState.clone(), this.myMark, this.param.clone());
    }

    /**
     * 評価値を返す
     * @returns 評価値
     */
    public evaluate(): number {
        const myMarkCount = this.mapState.getMarkCount(this.myMark);
        const opponentMarkCount = this.mapState.getMarkCount(MarkTypeUtil.getOpponent(this.myMark));
        return myMarkCount - opponentMarkCount;
    }

    /**
     * ゲーム（シミュレーション）が終了したかどうかを返す
     * @returns ゲーム（シミュレーション）が終了した場合はtrue
     */
    public isDone(): boolean {
        return this.mapState.isDone();
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
    public isAlphaCut(minScore: number): boolean {
        this.param.beta = Math.min(this.param.beta, minScore)
        return this.param.alpha >= this.param.beta
    }

    /**
     * ベータカットの処理を行い、ベータカットが発生するかどうかを返す
     * @param maxScore 最大スコア
     * @returns ベータカットが発生する場合はtrue
     */
    public isBetaCut(maxScore: number): boolean {
        this.param.alpha = Math.max(this.param.alpha, maxScore)
        return this.param.alpha >= this.param.beta
    }
}