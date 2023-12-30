import { MapState } from "../../../entity/mapState";
import { MarkType } from "../../../type/markType";
import { EvaluatedScoreUtil } from "../../../util/evaluatedScoreUtil";
import { SimulateParam } from "../param/simulateParam";
import { SimulateService } from "../simulateService";

/**
 * 重み付きマップでシミュレートするクラス
 */
export class WeightMapEvaluate extends SimulateService {
    constructor(mapState: MapState, myMark: MarkType, param: SimulateParam) {
        super(mapState, myMark, param);
    }

    /**
     * 重み付きマップでシミュレートした評価値を返す
     * @returns 評価値
     */
    public evaluate(): number {
        const putScore = EvaluatedScoreUtil.getByPutCoords(this.mapState, this.myMark);
        const putableScore = EvaluatedScoreUtil.getByPutableCoords(this.mapState, this.myMark);
        return putScore + putableScore;
    }
}