import { MapState } from "../../entity/mapState";
import { MarkType } from "../../type/markType";
import { MarkTypeUtil } from "../../util/markTypeUtil";

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

    constructor(mapState: MapState, myMark: MarkType) {
        this.mapState = mapState;
        this.myMark = myMark;
    }

    /**
     * シミュレーションを複製する
     * @returns 
     */
    public clone(): SimulateService {
        return new SimulateService(this.mapState.clone(), this.myMark);
    }

    public evaluate(): number {
        const myMarkCount = this.mapState.getMarkCount(this.myMark);
        const opponentMarkCount = this.mapState.getMarkCount(MarkTypeUtil.getOpponent(this.myMark));
        return myMarkCount - opponentMarkCount;
    }

    public isDone(): boolean {
        return this.mapState.isDone();
    }

    public isMyTurn(): boolean {
        return this.mapState.getNowTurnMark() === this.myMark;
    }
}