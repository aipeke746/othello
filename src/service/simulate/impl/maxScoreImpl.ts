import { MapState } from "../../../entity/mapState";
import { MarkType } from "../../../type/markType";
import { MarkTypeUtil } from "../../../util/markTypeUtil";
import { SimulateParam } from "../param/simulateParam";
import { SimulateService } from "../simulateService";

/**
 * 重み付きマップでシミュレートするクラス
 */
export class MaxScoreImpl extends SimulateService {
    constructor(mapState: MapState, myMark: MarkType, param: SimulateParam) {
        super(mapState, myMark, param);
    }

    /**
     * シミュレーションを複製する
     * @returns 
     */
    public clone(): MaxScoreImpl {
        return new MaxScoreImpl(this.mapState.clone(), this.myMark, this.param.clone());
    }

    /**
     * 重み付きマップでシミュレートした評価値を返す
     * @returns 評価値
     */
    public evaluate(): number {
        const myMarkCount = this.mapState.getMarkCount(this.myMark);
        const opponentMarkCount = this.mapState.getMarkCount(MarkTypeUtil.getOpponent(this.myMark));
        return myMarkCount - opponentMarkCount;
    }
}