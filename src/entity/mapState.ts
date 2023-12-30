import { MarkType } from "../type/markType";
import { MarkTypeUtil } from "../util/markTypeUtil";
import { PutMarkUtil } from "../util/putMarkUtil";
import { ReverseMarkUtil } from "../util/reverseMarkUtil";
import { Coord } from "../vo/coord";

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
    private field: number[][] = Array.from(Array(MapState.LENGTH), () => new Array(MapState.LENGTH).fill(MarkType.NONE));
    /**
     * 現在のターン
     */
    private nowTurnMark: MarkType = MarkType.BLACK;

    /**
     * マップの初期化を行い、オセロの初期配置を行う
     */
    constructor() {
        this.init();
    }

    /**
     * 指定した座標に指定したマークを置き、ひっくり返す
     * @param coord 座標
     * @param mark マーク
     */
    public advance(coord: Coord, mark: MarkType): void {
        ReverseMarkUtil.reverse(this, coord, mark);
        this.nextTurn();
        if (!PutMarkUtil.isPutable(this)) {
            this.nextTurn();
        }
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
     * マップの初期化（オセロの初期配置）
     * 4x4のマスに白黒を交互に配置する
     */
    private init(): void {
        this.field = Array.from(Array(MapState.LENGTH), () => new Array(MapState.LENGTH).fill(MarkType.NONE));
        this.field[3][3] = MarkType.WHITE;
        this.field[4][4] = MarkType.WHITE;
        this.field[3][4] = MarkType.BLACK;
        this.field[4][3] = MarkType.BLACK;

        this.nowTurnMark = MarkType.BLACK;
    }
}