import { Tilemap } from '../../../entity/map/tilemap';
import { SimulateFactory } from '../../../factory/simulateFactory';
import type { MarkType } from '../../../type/markType';
import { MarkTypeUtil } from '../../../util/mark/markTypeUtil';
import type { Coord } from '../../../vo/coord';
import { SimulateParam } from '../../simulate/param/simulateParam';
import type { OperateService } from '../operateService';
import { SimulateType } from '../../../type/simulateType';
import type { SimulateService } from '../../simulate/simulateService';
import { PutMarkUtil } from '../../../util/map/putMarkUtil';
import { GameUtil } from '../../../util/map/gameUtil';

/**
 * αβ法で操作するクラス
 */
export class AlphaBetaImpl implements OperateService {
    /**
     * 探索する深さ
     */
    private readonly depth: number = 7;
    /**
     * シミュレーションのタイプ（評価値の計算方法）
     */
    private readonly simulateType: SimulateType = SimulateType.MAX_SCORE;

    /**
     * 次にオセロのマークをセットする座標を返す
     * @param tilemap タイルマップ
     * @param myMark 自分のマーク
     * @returns 座標
     */
    public getCoord(tilemap: Tilemap, myMark: MarkType): Coord | undefined {
        const param: SimulateParam = new SimulateParam(this.depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        const simulate: SimulateService = new SimulateFactory(tilemap.mapState.clone(), myMark, param).create(
            this.simulateType
        );
        const result: [number, Coord | undefined] = this.getAlphaBetaCoord(simulate);

        return result[1];
    }

    /**
     * αβ法で座標を返す
     * @param simulate シミュレーション
     * @returns スコアと座標
     */
    private getAlphaBetaCoord(simulate: SimulateService): [number, Coord | undefined] {
        if (simulate.isDone() || simulate.param.depth === 0) {
            return [simulate.evaluate(), undefined];
        }

        return simulate.isMyTurn() ? this.getMaxScoreCoord(simulate) : this.getMiniScoreCoord(simulate);
    }

    /**
     * 最大スコアと座標を返す
     * （自身のターン場合）
     * @param simulate シミュレーション
     * @returns 最大スコアと座標
     */
    private getMaxScoreCoord(simulate: SimulateService): [number, Coord | undefined] {
        const targetMark = simulate.myMark;
        const maxScore: [number, Coord | undefined] = [Number.NEGATIVE_INFINITY, undefined];

        for (const coord of PutMarkUtil.getPutableCoords(simulate.mapState, targetMark)) {
            const childScore = this.getChildScore(simulate, targetMark, coord);
            if (childScore > maxScore[0]) {
                maxScore[0] = childScore;
                maxScore[1] = coord;
            }
            if (simulate.betaCut(maxScore[0])) {
                break;
            }
        }
        return maxScore;
    }

    /**
     * 最小スコアと座標を返す
     * （相手のターン場合）
     * @param simulate シミュレーション
     * @returns 最小スコアと座標
     */
    private getMiniScoreCoord(simulate: SimulateService): [number, Coord | undefined] {
        const targetMark = MarkTypeUtil.getOpponent(simulate.myMark);
        const minScore: [number, Coord | undefined] = [Number.POSITIVE_INFINITY, undefined];

        for (const coord of PutMarkUtil.getPutableCoords(simulate.mapState, targetMark)) {
            const childScore = this.getChildScore(simulate, targetMark, coord);
            if (childScore < minScore[0]) {
                minScore[0] = childScore;
                minScore[1] = coord;
            }
            if (simulate.alphaCut(minScore[0])) {
                break;
            }
        }
        return minScore;
    }

    /**
     * 子ノードのスコアを返す
     * @param simulate シミュレーション
     * @param mark マーク
     * @param coord 座標
     * @returns スコア
     */
    private getChildScore(simulate: SimulateService, mark: MarkType, coord: Coord): number {
        const nextSimulate = simulate.clone();
        GameUtil.simulateAdvance(nextSimulate, mark, coord);
        nextSimulate.param.depth--;

        return this.getAlphaBetaCoord(nextSimulate)[0];
    }
}
