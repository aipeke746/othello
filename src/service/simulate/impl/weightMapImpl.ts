import { MapState } from '../../../entity/map/mapState';
import { MarkType } from '../../../type/markType';
import { EvaluatedScoreUtil } from '../../../util/simulate/evaluatedScoreUtil';
import { SimulateParam } from '../param/simulateParam';
import { SimulateService } from '../simulateService';

/**
 * 重み付きマップでシミュレートするクラス
 */
export class WeightMapImpl extends SimulateService {
    constructor(mapState: MapState, myMark: MarkType, param: SimulateParam) {
        super(mapState, myMark, param);
    }

    /**
     * シミュレーションを複製する
     * @returns
     */
    public clone(): WeightMapImpl {
        return new WeightMapImpl(
            this.mapState.clone(),
            this.myMark,
            this.param.clone()
        );
    }

    /**
     * 重み付きマップでシミュレートした評価値を返す
     * @returns 評価値
     */
    public evaluate(): number {
        const putScore = EvaluatedScoreUtil.getByPutCoords(
            this.mapState,
            this.myMark
        );
        const putableScore = EvaluatedScoreUtil.getByPutableCoords(
            this.mapState,
            this.myMark
        );
        const finishScore = EvaluatedScoreUtil.getByFinish(
            this.mapState,
            this.myMark
        );

        return putScore + putableScore + finishScore;
    }
}
