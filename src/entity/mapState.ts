import { MarkType } from "../type/markType";
import { DirectionUtil } from "../util/directionUtil";
import { MarkTypeUtil } from "../util/markTypeUtil";
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
        this.reverse(coord, mark);
        this.nextTurn();
        if (!this.isPutable(this.nowTurnMark)) {
            this.nextTurn();
        }
    }

    /**
     * ゲームの終了判定
     * マークを置ける場所がない場合はゲーム終了
     * @returns ゲーム終了の場合はtrue
     */
    public isDone(): boolean {
        return this.isFilled() || this.isNotPutable();
    }

    /**
     * マップの状態を複製する
     * @returns マップの状態
     */
    public clone(): MapState {
        const mapState: MapState = new MapState();
        mapState.field = JSON.parse(JSON.stringify(this.field));
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
     * 指定したマークで置ける座標を取得する
     * @param mark マーク
     * @returns 置ける座標
     */
    public getPutableCoords(mark: MarkType): Coord[] {
        const putableCoords: Coord[] = [];
        for (const coord of this.getCoordNoneMark()) {
            if (this.isReversible(coord, mark)) {
                putableCoords.push(coord);
            }
        }
        return putableCoords;
    }

    /**
     * 指定した座標に指定したマークを置けるかどうか
     * @param coord 座標
     * @param mark マーク
     * @returns 置ける場合はtrue
     */
    public isReversible(coord: Coord, mark: MarkType): boolean {
        return this.getReversibleCoords(mark, coord).length > 0;
    }

    /**
     * 指定した座標に指定したマークを置いて、ひっくり返す
     * @param coord 座標
     * @param mark マーク
     */
    private reverse(coord: Coord, mark: MarkType): void {
        this.field[coord.y][coord.x] = mark;

        const coords = this.getReversibleCoords(mark, coord);
        for (const coord of coords) {
            this.field[coord.y][coord.x] = mark;
        }
    }

    /**
     * 指定した座標に指定したマークを置いた場合にひっくり返せる全ての座標を取得する
     * @param mark 使用するマーク
     * @param coord マークを置く座標
     * @returns ひっくり返せる全ての座標
     */
    private getReversibleCoords(mark: MarkType, coord: Coord): Coord[] {
        return DirectionUtil.getDiff()
            .flatMap(
                diff => this.reversibleCoords(mark, coord, diff)
            );
    }

    /**
     * 指定した座標の位置から上下左右に移動していき、ひっくり返せる座標を取得する
     * @param mark 使用するマーク
     * @param coord マークを置く座標
     * @param diff 座標の差分（上下左右に移動するための値）
     * @returns ひっくり返せる座標
     */
    private reversibleCoords(mark: MarkType, coord: Coord, diff: Phaser.Math.Vector2): Coord[] {
        let coords: Coord[] = [];
        let count = 0;
        let pos = new Phaser.Math.Vector2(coord.x, coord.y);

        while (true) {
            pos.add(diff);
            if (this.skip(pos)) break;

            if (this.field[pos.y][pos.x] == MarkTypeUtil.getOpponent(mark)) {
                count += 1;
            } else if (this.field[pos.y][pos.x] == mark) {
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
    private skip(pos: Phaser.Math.Vector2): boolean {
        return (pos.x<0 || pos.x>MapState.LENGTH-1 || pos.y<0 || pos.y>MapState.LENGTH-1)
            || (this.field[pos.y][pos.x] == MarkType.NONE);
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
    }

    /**
     * マークを置ける場所がどこにもないかどうか
     * @returns マークを置ける場所がない場合はtrue
     */
    isNotPutable(): boolean {
        return !this.isPutable(MarkType.BLACK) && !this.isPutable(MarkType.WHITE);
    }

    /**
     * 指定したマークを置ける場所があるかどうか
     * @param mark マーク
     * @returns 置ける場所がある場合はtrue
     */
    private isPutable(mark: MarkType): boolean {
        return this.getPutableCoords(mark).length > 0;
    }

    /**
     * マークが置かれていない座標を取得する
     */
    private getCoordNoneMark(): Coord[] {
        const coords: Coord[] = [];
        for (let y=0; y<MapState.LENGTH; y++) {
            for (let x=0; x<MapState.LENGTH; x++) {
                if (this.field[y][x] === MarkType.NONE) {
                    const pos = new Phaser.Math.Vector2(x, y);
                    coords.push(new Coord(pos));
                }
            }
        }
        return coords;
    }

    /**
     * マップが埋まっているかどうか
     * @returns マップが埋まっている場合はtrue
     */
    private isFilled(): boolean {
        return this.field.every((row) => row.every((mark) => mark !== MarkType.NONE));
    }
}