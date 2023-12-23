import { Tilemap } from "../../../entity/tilemap";
import { MarkType } from "../../../type/markType";
import { MarkTypeUtil } from "../../../util/markTypeUtil";
import { Coord } from "../../../vo/coord";
import { SimulateService } from "../../simulate/simulateService";
import { OperateService } from "../operateService";

/**
 * αβ法で操作するクラス
 */
export class AlphaBetaImpl implements OperateService {
    /**
     * 無限大
     */
    private readonly INF: number = 1000000000;
    /**
     * 探索する深さ
     */
    private depth: number = 3;

    /**
     * 次にオセロのマークを置く座標を返す
     * @param tilemap タイルマップ
     * @param myMark 自分のマーク
     * @returns 次の座標
     */
    public getCoord(tilemap: Tilemap, myMark: MarkType): Coord | undefined {
        const simulate: SimulateService = new SimulateService(tilemap.mapState.clone(), myMark);
        const result: [number, Coord | undefined] = this.getAlphaBetaCoord(simulate, this.depth, -this.INF, this.INF);

        return result[1];
    }

    /**
     * αβ法で座標を返す
     * @param simulate シミュレーション
     * @param depth 探索深さ
     * @param alpha α値
     * @param beta β値
     * @returns スコアと座標
     */
    private getAlphaBetaCoord(simulate: SimulateService, depth: number, alpha: number, beta: number): [number, Coord | undefined] {
        if (simulate.isDone() || depth === 0) {
            return [simulate.evaluate(), undefined];
        }

        return simulate.isMyTurn()
            ? this.getMaxScoreCoord(simulate, depth, alpha, beta)
            : this.getMiniScoreCoord(simulate, depth, alpha, beta);
    }

    /**
     * 最大スコアと座標を返す
     * @param simulate シミュレーション
     * @param depth 探索深さ
     * @param alpha α値
     * @param beta β値
     * @returns 最大スコアと座標
     */
    private getMaxScoreCoord(simulate: SimulateService, depth: number, alpha: number, beta: number): [number, Coord | undefined] {
        const targetMark = simulate.myMark
        let maxScore: [number, Coord | undefined] = [-this.INF, undefined];

        for (const coord of simulate.mapState.getPutableCoords(targetMark)) {
            const childScore = this.getChildScore(simulate, depth, alpha, beta, targetMark, coord);
            if (childScore > maxScore[0]) {
                maxScore[0] = childScore;
                maxScore[1] = coord;
            }
            alpha = Math.max(alpha, maxScore[0]);
            if (alpha >= beta) {
                break; // βカット
            }
        }
        return maxScore;
    }

    /**
     * 最小スコアと座標を返す
     * @param simulate シミュレーション
     * @param depth 探索深さ
     * @param alpha α値
     * @param beta β値
     * @returns 最小スコアと座標
     */
    private getMiniScoreCoord(simulate: SimulateService, depth: number, alpha: number, beta: number): [number, Coord | undefined] {
        const targetMark = MarkTypeUtil.getOpponent(simulate.myMark);
        let miniScore: [number, Coord | undefined] = [this.INF, undefined];

        for (const coord of simulate.mapState.getPutableCoords(targetMark)) {
            const childScore = this.getChildScore(simulate, depth, alpha, beta, targetMark, coord);
            if (childScore < miniScore[0]) {
                miniScore[0] = childScore;
                miniScore[1] = coord;
            }
            beta = Math.min(beta, miniScore[0]);
            if (alpha >= beta) {
                break; // αカット
            }
        }
        return miniScore;
    }

    /**
     * 子ノードのスコアを返す
     * @param simulate シミュレーション
     * @param depth 探索深さ
     * @param alpha α値
     * @param beta β値
     * @param mark マーク
     * @param coord 座標
     * @returns スコア
     */
    private getChildScore(simulate: SimulateService, depth: number, alpha: number, beta: number, mark: MarkType, coord: Coord): number {
        const nextSimulate = simulate.clone();
        nextSimulate.mapState.advance(coord, mark);

        return this.getAlphaBetaCoord(nextSimulate, depth - 1, alpha, beta)[0];
    }
}




