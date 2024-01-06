import { FieldFactory } from "../../factory/fieldFactory";
import { FieldType } from "../../type/fieldType";
import { MarkType } from "../../type/markType";
import { MarkTypeUtil } from "../../util/mark/markTypeUtil";
import { Coord } from "../../vo/coord";

/**
 * マップの状態を表すクラス
 */
export class MapState {
    /**
     * タイルのピクセルサイズ
     */
    public static readonly SIZE: number = 64;
    /**
     * マップの行数・列数
     */
    public static readonly LENGTH: number = 8;
    /**
     * オセロのマスを表す二次元配列
     */
    private field: MarkType[][];
    /**
     * 現在のターン
     */
    private nowTurnMark: MarkType;

    /**
     * マップの初期化を行い、オセロの初期配置を行う
     */
    constructor() {
        this.field = FieldFactory.create(FieldType.CROSS);
        this.nowTurnMark = MarkType.BLACK
    }

    /**
     * マップの状態を複製する
     * @returns マップの状態
     */
    public clone(): MapState {
        const mapState: MapState = new MapState();
        mapState.field = JSON.parse(JSON.stringify(this.field));
        mapState.nowTurnMark = this.nowTurnMark;
        return mapState;
    }

    /**
     * マップの状態を取得する
     * @returns マップの状態
     */
    public getField(): number[][] {
        return this.field;
    }

    /**
     * 現在のターンのマークを取得する
     * @returns 現在のターンのマーク
     */
    public getNowTurnMark(): MarkType {
        return this.nowTurnMark;
    }

    /**
     * ターンを交代する
     */
    public nextTurn(): void {
        this.nowTurnMark = MarkTypeUtil.getOpponent(this.nowTurnMark);
    }

    /**
     * 指定したマークの数を取得する
     * @param mark マーク
     * @returns マークの数
     */
    public getMarkCount(mark: MarkType): number {
        let count = 0;
        for (let y=0; y<MapState.LENGTH; y++) {
            for (let x=0; x<MapState.LENGTH; x++) {
                if (this.field[y][x] === mark) {
                    count += 1;
                }
            }
        }
        return count;
    }

    /**
     * 指定したマークが置かれている座標を取得する
     * @param mark マーク
     * @returns 座標
     */
    public getMarkCoords(mark: MarkType): Coord[] {
        const coords: Coord[] = [];
        for (let y=0; y<MapState.LENGTH; y++) {
            for (let x=0; x<MapState.LENGTH; x++) {
                if (this.field[y][x] === mark) {
                    const pos = new Phaser.Math.Vector2(x, y);
                    coords.push(new Coord(pos));
                }
            }
        }
        return coords;
    }

    /**
     * 指定した座標のマークを取得する
     * @param coord 座標
     * @returns マーク
     */
    public getMark(pos: Coord | Phaser.Math.Vector2): MarkType {
        return this.field[pos.y][pos.x];
    }

    /**
     * 指定した座標にマークを置く
     * @param mark マーク
     * @param coord 座標
     */
    public setMark(mark: MarkType, coord: Coord): void {
        this.field[coord.y][coord.x] = mark;
    }
}