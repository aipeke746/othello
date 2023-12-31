import { MapState } from "../entity/map/mapState";

/**
 * タイルマップ（オセロ）の座標を表すクラス
 */
export class Coord {
    /**
     * タイルマップのx座標
     */
    public readonly x: integer;
    /**
     * タイルマップのｙ座標
     */
    public readonly y: integer;

    /**
     * タイルマップの座標を生成する（マップ外の座標の場合は例外を投げる）
     * @param pos ワールドの座標
     */
    constructor(pos: Phaser.Math.Vector2) {
        this.x = pos.x;
        this.y = pos.y;

        if (this.inValid()) {
            throw new Error('invalid coord');
        }
    }

    /**
     * 対象の座標と等しいかどうかを返す
     * @param coord 対象の座標
     * @returns 対象の座標と等しい場合はtrue
     */
    public equals(coord: Coord): boolean {
        return this.x === coord.x && this.y === coord.y;
    }

    /**
     * 指定した座標が無効かどうかを返す
     * 座標がマップ外の場合は無効（true）
     * @returns 無効な座標の場合はtrue
     */
    private inValid(): boolean {
        return ((this.x < 0 || MapState.LENGTH <= this.x) || (this.y < 0 || MapState.LENGTH <= this.y))
    }
}