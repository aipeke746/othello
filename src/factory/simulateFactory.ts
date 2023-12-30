import { MapState } from "../entity/mapState";
import { WeightMapEvaluate } from "../service/simulate/evaluate/weightMapEvaluate";
import { SimulateParam } from "../service/simulate/param/simulateParam";
import { SimulateService } from "../service/simulate/simulateService";
import { MarkType } from "../type/markType";
import { SimulateType } from '../type/simulateType';

export class SimulateFactory {
    public static create(type: SimulateType, mapState: MapState, myMark: MarkType, param: SimulateParam) {
        switch (type) {
            case SimulateType.MAX_SCORE:
                return new SimulateService(mapState, myMark, param);
            case SimulateType.WEIGHT_MAP:
                return new WeightMapEvaluate(mapState, myMark, param);
            default:
                throw new Error(`SimulateFactory.create: type=${type}`);
        }
    }
}