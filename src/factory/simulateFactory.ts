import { MapState } from '../entity/map/mapState';
import { MaxScoreImpl } from '../service/simulate/impl/maxScoreImpl';
import { WeightMapImpl } from '../service/simulate/impl/weightMapImpl';
import type { SimulateParam } from '../service/simulate/param/simulateParam';
import type { SimulateService } from '../service/simulate/simulateService';
import type { MarkType } from '../type/markType';
import { SimulateType } from '../type/simulateType';

/**
 * シミュレーションのファクトリークラス
 */
export class SimulateFactory {
    /**
     * シミュレーション方法を生成する
     * @param type シミュレーションの種類
     * @param mapState マップの状態
     * @param myMark 対象のマーク
     * @param param αβ法の探索パラメータ
     * @returns シミュレーション
     */
    public static create(
        type: SimulateType,
        mapState: MapState,
        myMark: MarkType,
        param: SimulateParam
    ): SimulateService {
        switch (type) {
            case SimulateType.MAX_SCORE:
                return new MaxScoreImpl(mapState, myMark, param);
            case SimulateType.WEIGHT_MAP:
                return new WeightMapImpl(mapState, myMark, param);
            default:
                throw new Error('SimulateFactory.create type error');
        }
    }
}
