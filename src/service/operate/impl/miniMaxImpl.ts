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
        const result: [number, Coord | undefined] = this.getMiniMaxCoord(simulate, this.depth);
        return result[1]
    }

    /**
     * 
     * @param simulate シミュレーション
     * @param depth 
     * @returns 
     */
    private getMiniMaxCoord(simulate: SimulateService, depth: number): [number, Coord | undefined] {
        if (simulate.isDone() || depth === 0) {
            return [simulate.evaluate(), undefined];
        }

        let bestScoreCoord: [number, Coord | undefined] = [-this.INF, undefined];
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

    private getChildScore(simulate_: SimulateService, depth: number, mark: MarkType, coord: Coord): number {
        const simulate = simulate_.clone();
        simulate.mapState.advance(coord, mark);

        return this.getMiniMaxCoord(simulate, depth - 1)[0];
    }





    // private getMiniMaxCoord_2(simulate: SimulateService, depth: number): [number, Coord | undefined] {
    //     if (simulate.isDone() || depth === 0) {
    //         return [simulate.evaluate(), undefined];
    //     }

    //     const targetMark = simulate.isMyTurn() ? simulate.myMark : MarkTypeUtil.getOpponent(simulate.myMark);
    //     if (simulate.isMyTurn()) {
    //         // 自分のターン
    //         let maxScore: [number, Coord | undefined] = [-this.INF, undefined];
    //         for (const coord of simulate.mapState.getPutableCoords(targetMark)) {
    //             const childScore = this.getChildScore_2(simulate, depth, targetMark, coord);
    //             if (childScore[0] > maxScore[0]) {
    //                 maxScore[0] = childScore[0];
    //                 maxScore[1] = coord;
    //             }
    //         }
    //         return maxScore;
    //     } else {
    //         // 相手のターン
    //         let miniScore: [number, Coord | undefined] = [this.INF, undefined];
    //         for (const coord of simulate.mapState.getPutableCoords(targetMark)) {
    //             const childScore = this.getChildScore_2(simulate, depth, targetMark, coord);
    //             if (childScore[0] < miniScore[0]) {
    //                 miniScore[0] = childScore[0];
    //                 miniScore[1] = coord;
    //             }
    //         }
    //         return miniScore;
    //     }
    // }

    // private getChildScore_2(simulate_: SimulateService, depth: number, mark: MarkType, coord: Coord): [number, Coord | undefined] {
    //     const simulate = simulate_.clone();
    //     simulate.mapState.advance(coord, mark);

    //     return this.getMiniMaxCoord_2(simulate, depth - 1);
    // }
}