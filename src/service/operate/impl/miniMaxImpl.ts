import { Tilemap } from "../../../entity/tilemap";
import { MarkType } from "../../../type/markType";
import { MarkTypeUtil } from "../../../util/markTypeUtil";
import { Coord } from "../../../vo/coord";
import { SimulateService } from "../../simulate/simulateService";
import { OperateService } from "../operateService";

/**
 * ミニマックス法で操作するクラス
 */
export class MiniMaxImpl implements OperateService {
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
        const result: [number, Coord | undefined] = this.getMiniMaxCoord(simulate, this.depth);
        return result[1]
    }

    /**
     * ミニマックス法で座標を返す
     * @param simulate シミュレーション
     * @param depth 探索深さ
     * @returns スコアと座標
     */
    private getMiniMaxCoord(simulate: SimulateService, depth: number): [number, Coord | undefined] {
        if (simulate.isDone() || depth === 0) {
            return [simulate.evaluate(), undefined];
        }

        let bestScoreCoord: [number, Coord | undefined] = [Number.NEGATIVE_INFINITY, undefined];
        const targetMark = simulate.isMyTurn() ? simulate.myMark : MarkTypeUtil.getOpponent(simulate.myMark);
        const turnSign: number = simulate.isMyTurn() ? 1 : -1;

        for (const coord of simulate.mapState.getPutableCoords(targetMark)) {
            const childScore = turnSign * this.getChildScore(simulate, depth, targetMark, coord);

            if (childScore > bestScoreCoord[0]) {
                bestScoreCoord[0] = childScore;
                bestScoreCoord[1] = coord;
            }
        }

        bestScoreCoord[0] *= turnSign;
        return bestScoreCoord;
    }

    /**
     * 子ノードのスコアを返す
     * @param simulate シミュレーション
     * @param depth 探索深さ
     * @param mark マーク
     * @param coord 座標
     * @returns スコア
     */
    private getChildScore(simulate: SimulateService, depth: number, mark: MarkType, coord: Coord): number {
        const nextSimulate = simulate.clone();
        nextSimulate.mapState.advance(coord, mark);

        return this.getMiniMaxCoord(nextSimulate, depth - 1)[0];
    }
}