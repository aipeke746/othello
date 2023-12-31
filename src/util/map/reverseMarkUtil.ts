import { MapState } from "../../entity/map/mapState";
import { MarkType } from "../../type/markType";
import { Coord } from "../../vo/coord";
import { DirectionUtil } from "./directionUtil";
import { MarkTypeUtil } from "../mark/markTypeUtil";

/**
 * マークをひっくり返すユーティリティクラス
 */
export class ReverseMarkUtil {
    /**
     * 指定した座標に指定したマークを置いて、ひっくり返す
     * @param coord 座標
     * @param mark マーク
     */
    public static reverse(mapState: MapState, coord: Coord, mark: MarkType): void {
        mapState.setMark(mark, coord);

        const coords = this.getReversibleCoords(mapState, mark, coord);
        for (const coord of coords) {
            mapState.setMark(mark, coord);
        }
    }

    /**
     * 指定した座標に指定したマークを置けるかどうか
     * @param coord 座標
     * @param mark マーク
     * @returns 置ける場合はtrue
     */
    public static isReversible(mapState: MapState, coord: Coord, mark: MarkType): boolean {
        if (mapState.getMark(coord) !== MarkType.NONE) {
            return false;
        }
        return this.getReversibleCoords(mapState, mark, coord).length > 0;
    }

    /**
     * 指定した座標に指定したマークを置いた場合にひっくり返せる全ての座標を取得する
     * @param mark 使用するマーク
     * @param coord マークを置く座標
     * @returns ひっくり返せる全ての座標
     */
    public static getReversibleCoords(mapState: MapState, mark: MarkType, coord: Coord): Coord[] {
        return DirectionUtil.getDiff()
            .flatMap(
                diff => this.reversibleCoords(mapState, mark, coord, diff)
            );
    }

    /**
     * 指定した座標の位置から上下左右に移動していき、ひっくり返せる座標を取得する
     * @param mark 使用するマーク
     * @param coord マークを置く座標
     * @param diff 座標の差分（上下左右に移動するための値）
     * @returns ひっくり返せる座標
     */
    private static reversibleCoords(mapState: MapState, mark: MarkType, coord: Coord, diff: Phaser.Math.Vector2): Coord[] {
        let coords: Coord[] = [];
        let count = 0;
        let pos = new Phaser.Math.Vector2(coord.x, coord.y);

        while (true) {
            pos.add(diff);
            if (this.skip(mapState, pos)) break;

            if (mapState.getMark(pos) == MarkTypeUtil.getOpponent(mark)) {
                count += 1;
            } else if (mapState.getMark(pos) == mark) {
                for (let i=0; i<count; i++) {
                    pos.subtract(diff);
                    coords.push(new Coord(pos));
                }
                break;
            }
        }
        return coords;
    }

    /**
     * ひっくり返せない場合はスキップする
     * @param pos 座標の位置
     * @returns スキップする場合はtrue
     */
    private static skip(mapState: MapState, pos: Phaser.Math.Vector2): boolean {
        return (pos.x<0 || pos.x>MapState.LENGTH-1 || pos.y<0 || pos.y>MapState.LENGTH-1)
            || (mapState.getMark(pos) === MarkType.NONE);
    }
}