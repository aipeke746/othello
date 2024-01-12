import { MapState } from "../../entity/map/mapState";
import { MarkType } from "../../type/markType";
import { Coord } from "../../vo/coord";
import { DirectionUtil } from "./directionUtil";
import { MarkTypeUtil } from "../mark/markTypeUtil";

/**
 * マークをひっくり返すことに関連するユーティリティクラス
 */
export class ReverseMarkUtil {
    /**
     * 指定した座標にマークをセットして、ひっくり返す
     * @param mapState マップの状態
     * @param putCoord 座標
     * @param mark マーク
     */
    public static reverse(mapState: MapState, putCoord: Coord, mark: MarkType): void {
        mapState.setMark(mark, putCoord);

        const coords = this.getReversibleCoords(mapState, mark, putCoord);
        for (const coord of coords) {
            mapState.setMark(mark, coord);
        }
    }

    /**
     * 指定した座標に指定したマークをセットできるかどうか
     * @param mapState マップの状態
     * @param putCoord 座標
     * @param mark マーク
     * @returns セットできる場合はtrue
     */
    public static isReversible(mapState: MapState, putCoord: Coord, mark: MarkType): boolean {
        if (mapState.getMark(putCoord) !== MarkType.EMPTY) {
            return false;
        }
        return this.getReversibleCoords(mapState, mark, putCoord).length > 0;
    }

    /**
     * 指定した座標にマークをセットした場合にひっくり返せる全ての座標を取得する
     * @param mapState マップの状態
     * @param mark マーク
     * @param putCoord マークをセットする座標
     * @returns ひっくり返せる全ての座標
     */
    public static getReversibleCoords(mapState: MapState, mark: MarkType, putCoord: Coord): Coord[] {
        return DirectionUtil.getDiff()
            .flatMap(
                diff => this.reversibleCoords(mapState, mark, putCoord, diff)
            );
    }

    /**
     * 指定した座標の位置から上下左右に移動していき、ひっくり返せる座標を取得する
     * @param mark 使用するマーク
     * @param putCoord マークをセットする座標
     * @param diff 座標の差分（上下左右に移動するための値）
     * @returns ひっくり返せる座標
     */
    private static reversibleCoords(mapState: MapState, mark: MarkType, putCoord: Coord, diff: Phaser.Math.Vector2): Coord[] {
        let coords: Coord[] = [];
        let count = 0;
        let pos = new Phaser.Math.Vector2(putCoord.x, putCoord.y);

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
     * スキップするかどうか
     * ひっくり返せない場合はスキップ
     * @param pos タイルマップの座標
     * @returns スキップする場合はtrue
     */
    private static skip(mapState: MapState, pos: Phaser.Math.Vector2): boolean {
        return this.outSidePos(pos) || this.skipMarkType(mapState, pos);
    }

    /**
     * 指定した座標がフィールドの判定の範囲外かどうか
     * @param pos タイルマップの座標
     * @returns フィールドの範囲外の場合は、true
     */
    private static outSidePos(pos: Phaser.Math.Vector2): boolean {
        return pos.x<0 || pos.x>MapState.LENGTH-1
            || pos.y<0 || pos.y>MapState.LENGTH-1;
    }

    /**
     * スキップ対象のマークかどうか
     * @param mapState マップの状態
     * @param pos タイルマップの座標
     * @returns スキップ対象のマークの場合はtrue
     */
    private static skipMarkType(mapState: MapState, pos: Phaser.Math.Vector2): boolean {
        return (mapState.getMark(pos) === MarkType.EMPTY)
            || (mapState.getMark(pos) === MarkType.NONE);
    }
}