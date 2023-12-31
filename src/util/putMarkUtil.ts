import { MapState } from "../entity/mapState";
import { MarkType } from "../type/markType";
import { Coord } from "../vo/coord";
import { ReverseMarkUtil } from "./reverseMarkUtil";

/**
 * マークを置くユーティリティクラス
 */
export class PutMarkUtil {
    /**
     * ゲームの終了判定
     * マークを置ける場所がない場合はゲーム終了
     * @returns ゲーム終了の場合はtrue
     */
    public static isPutable(mapState: MapState): boolean {
        return this.isPutableMark(mapState, MarkType.BLACK)
            || this.isPutableMark(mapState, MarkType.WHITE);
    }

    /**
     * 指定したマークで置ける座標を取得する
     * @param mark マーク
     * @returns 置ける座標
     */
    public static getPutableCoords(mapState: MapState, mark: MarkType): Coord[] {
        const putableCoords: Coord[] = [];
        for (const coord of this.getCoordNoneMark(mapState)) {
            if (ReverseMarkUtil.isReversible(mapState, coord, mark)) {
                putableCoords.push(coord);
            }
        }
        return putableCoords;
    }

    /**
     * 指定したマークを置ける場所があるかどうか
     * @param mark マーク
     * @returns 置ける場所がある場合はtrue
     */
    private static isPutableMark(mapState: MapState, mark: MarkType): boolean {
        return this.getPutableCoords(mapState, mark).length > 0;
    }

    /**
     * マークが置かれていない座標を取得する
     */
    private static getCoordNoneMark(mapState: MapState): Coord[] {
        const coords: Coord[] = [];
        for (let y=0; y<MapState.LENGTH; y++) {
            for (let x=0; x<MapState.LENGTH; x++) {
                const pos = new Phaser.Math.Vector2(x, y);
                if (mapState.getMark(pos) === MarkType.NONE) {
                    coords.push(new Coord(pos));
                }
            }
        }
        return coords;
    }
}