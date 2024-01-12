import { MapState } from '../../entity/map/mapState';
import { MarkType } from '../../type/markType';
import { PutMarkUtil } from '../../util/map/putMarkUtil';
import { SimulateParam } from './param/simulateParam';

/**
 * αβ法でシミュレーションするクラス
 */
export abstract class SimulateService {
    /**
     * シミュレーションするマップの状態
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
    public abstract clone(): SimulateService;

    /**
     * オセロのフィールドに対して評価を行い、評価値を返す
     * @returns 評価値
     */
    public abstract evaluate(): number;

    /**
     * シミュレーションが終了したかどうかを返す
     * @returns シミュレーションが終了した場合はtrue
     */
    public isDone(): boolean {
        return !PutMarkUtil.isPutable(this.mapState);
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
    public alphaCut(minScore: number): boolean {
        this.param.beta = Math.min(this.param.beta, minScore);
        return this.param.alpha >= this.param.beta;
    }

    /**
     * ベータカットの処理を行い、ベータカットが発生するかどうかを返す
     * @param maxScore 最大スコア
     * @returns ベータカットが発生する場合はtrue
     */
    public betaCut(maxScore: number): boolean {
        this.param.alpha = Math.max(this.param.alpha, maxScore);
        return this.param.alpha >= this.param.beta;
    }
}
