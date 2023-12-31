import { MapState } from "../entity/map/mapState";
import { MaxScoreImpl } from "../service/simulate/impl/maxScoreImpl";
import { WeightMapImpl } from "../service/simulate/impl/weightMapImpl";
import { SimulateParam } from "../service/simulate/param/simulateParam";
import { MarkType } from "../type/markType";
import { SimulateType } from '../type/simulateType';

export class SimulateFactory {
    public static create(type: SimulateType, mapState: MapState, myMark: MarkType, param: SimulateParam) {
        switch (type) {
            case SimulateType.MAX_SCORE:
                return new MaxScoreImpl(mapState, myMark, param);
            case SimulateType.WEIGHT_MAP:
                return new WeightMapImpl(mapState, myMark, param);
            default:
                throw new Error(`SimulateFactory.create: type=${type}`);
        }
    }
}