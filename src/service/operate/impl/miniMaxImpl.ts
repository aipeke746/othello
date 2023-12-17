import { Tilemap } from "../../../entity/tilemap";
import { MarkType } from "../../../type/markType";
import { MarkTypeUtil } from "../../../util/markTypeUtil";
import { Coord } from "../../../vo/coord";
import { SimulateMiniMaxImpl } from "../../simulate/impl/simulateMiniMaxImpl";
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
    private depth: number = 100;

    /**
     * ミニマックス法で次にオセロのマークを置く座標を返す
     * @param tilemap タイルマップ
     * @param myMark 自分のマーク
     * @returns 次の座標
     */
    public getCoord(tilemap: Tilemap, myMark: MarkType): Coord {
        let bestCoord: Coord = new Coord(new Phaser.Math.Vector2(0, 0));
        let bestScore: number = -this.INF;

        for (const coord of tilemap.mapState.getPutableCoords(myMark)) {
            const simulate: SimulateService = new SimulateMiniMaxImpl(tilemap.mapState.clone(), myMark);
            simulate.mapState.advance(coord, myMark);

            this.miniMax(simulate, this.depth, false);

            if (simulate.evaluatedScore > bestScore) {
                bestScore = simulate.evaluatedScore;
                bestCoord = coord;
            }
        }
        return bestCoord;
    }

    /**
     * ミニマックス法でシミュレートする
     * @param simulate シミュレート
     * @param depth 深さ
     * @param myTurn 自分のターンかどうか
     */
    private miniMax(simulate: SimulateService, depth: number, myTurn: boolean) {
        if (simulate.isDone() || depth === 0) {
            simulate.evaluate();
            return;
        }

        let bestScore;
        if (myTurn) {
            // 自分のターン
            bestScore = -this.INF;
            for (const coord of simulate.mapState.getPutableCoords(simulate.myMark)) {
                simulate.mapState.advance(coord, simulate.myMark);

                this.miniMax(simulate, depth - 1, false);
                if (simulate.evaluatedScore > bestScore) {
                    bestScore = simulate.evaluatedScore;
                }
            }
        } else {
            // 相手のターン
            bestScore = this.INF;
            for (const coord of simulate.mapState.getPutableCoords(MarkTypeUtil.getOpponent(simulate.myMark))) {
                simulate.mapState.advance(coord, MarkTypeUtil.getOpponent(simulate.myMark));

                this.miniMax(simulate, depth - 1, true);
                if (simulate.evaluatedScore < bestScore) {
                    bestScore = simulate.evaluatedScore;
                }
            }
        }
    }
}