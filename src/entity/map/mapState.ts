import { FieldFactory } from "../../factory/fieldFactory";
import { Param } from "../../static/param";
import { FieldType } from "../../type/fieldType";
import { MarkType } from "../../type/markType";
import { MarkTypeUtil } from "../../util/mark/markTypeUtil";
import { Coord } from "../../vo/coord";

/**
 * マップの状態を表すクラス
 * 
 * オセロのフィールド上の状態（オセロのマークの配置、現在のターン）を管理する
 * TilemapクラスにMapStateクラスを渡して、オセロのフィールドを描画・更新する
 */
export class MapState {
    /**
     * オセロの1マスのピクセルサイズ
     */
    public static readonly SIZE: number = 64;
    /**
     * オセロのフィールドのマス目の行数・列数
     */
    public static readonly LENGTH: number = 8;
    /**
     * オセロのフィールドを表す二次元配列
     * オセロのマス目ごとにセットされているマークを返す
     */
    private field: MarkType[][];
    /**
     * 現在のターン
     */
    private nowTurnMark: MarkType;

    /**
     * マップの状態の初期化を行い、オセロのフィールドの初期配置を行う
     */
    constructor() {
        this.field = FieldFactory.create(Param.FIELD_TYPE);
        this.nowTurnMark = MarkType.BLACK
    }

    /**
     * マップの状態を複製する
     * （ゲームAIのシミュレーション用に使用）
     * @returns マップの状態
     */
    public clone(): MapState {
        const mapState: MapState = new MapState();
        mapState.field = JSON.parse(JSON.stringify(this.field));
        mapState.nowTurnMark = this.nowTurnMark;
        return mapState;
    }

    /**
     * フィールドを取得する
     * @returns マップの状態
     */
    public getField(): number[][] {
        return this.field;
    }

    /**
     * フィールドの種類を変更する
     * （メニュー画面でフィールドの種類を変更した場合に使用する）
     * @param fieldType フィールドタイプ
     */
    public setField(fieldType: FieldType): void {
        this.field = FieldFactory.create(fieldType);
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
     * マークを指定して、フィールド上にセットされたマークの数を取得する
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
     * 指定したマークがセットされている座標を全て取得する
     * @param mark マーク
     * @returns 指定したマークがセットされている全座標
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
     * 指定した座標にマークをセットする
     * @param mark マーク
     * @param coord 座標
     */
    public setMark(mark: MarkType, coord: Coord): void {
        this.field[coord.y][coord.x] = mark;
    }
}