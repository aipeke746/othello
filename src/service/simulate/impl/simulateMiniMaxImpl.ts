import { MapState } from "../../../entity/mapState";
import { MarkType } from "../../../type/markType";
import { MarkTypeUtil } from "../../../util/markTypeUtil";
import { SimulateService } from "../simulateService";

/**
 * ミニマックス法でシミュレートするクラス
 */
export class SimulateMiniMaxImpl implements SimulateService {
    /**
     * シミュレートするマップの状態
    */
    public mapState: MapState;
   /**
    * 自分のマーク
    */
   public myMark: MarkType;
    /**
     * 評価値
     */
    public evaluatedScore: number;

    constructor(mapState: MapState, myMark: MarkType, evaluatedScore: number = 0) {
        this.mapState = mapState;
        this.myMark = myMark;
        this.evaluatedScore = evaluatedScore;
    }

    /**
     * シミュレーションを複製する
     * @returns 
     */
    public clone(): SimulateService {
        return new SimulateMiniMaxImpl(this.mapState.clone(), this.myMark, this.evaluatedScore);
    }

    public evaluate(): void {
        const myMarkCount = this.mapState.getMarkCount(this.myMark);
        const opponentMarkCount = this.mapState.getMarkCount(MarkTypeUtil.getOpponent(this.myMark));
        const score = myMarkCount - opponentMarkCount;
        this.evaluatedScore = score;
    }

    public isDone(): boolean {
        return this.mapState.isDone();
    }
}