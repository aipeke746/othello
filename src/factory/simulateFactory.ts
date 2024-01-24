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
     * シミュレーションのマップ
     */
    private readonly MAP = new Map<SimulateType, SimulateService>();

    /**
     * シミュレーションのマップを設定する
     * @param mapState マップの状態
     * @param myMark 自分のマーク
     * @param param αβ法の探索パラメータ
     */
    constructor(mapState: MapState, myMark: MarkType, param: SimulateParam) {
        this.MAP.set(
            SimulateType.MAX_SCORE,
            new MaxScoreImpl(mapState, myMark, param)
        );
        this.MAP.set(
            SimulateType.WEIGHT_MAP,
            new WeightMapImpl(mapState, myMark, param)
        );
    }

    /**
     * シミュレーション方法を生成する
     * @param type シミュレーションの種類
     * @returns シミュレーション
     */
    public create(type: SimulateType): SimulateService {
        return this.MAP.get(type);
    }
}
