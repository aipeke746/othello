import { MapState } from "../../entity/map/mapState";
import { Tilemap } from "../../entity/map/tilemap";
import { MarkType } from "../../type/markType";

/**
 * 一手戻る（待った）機能
 */
export class TakeBackService {
    /**
     * 黒の一手戻るを使用した回数
     */
    private blackCount: number = 0;
    /**
     * 白の一手戻るを使用した回数
     */
    private whiteCount: number = 0;
    /**
     * 黒の一手前のマップの状態
     * 一手戻るを使用した時に表示するマップの状態
     */
    private blackMapState?: MapState;
    /**
     * 白の一手前のマップの状態
     * 一手戻るを使用した時に表示するマップの状態
     */
    private whiteMapState?: MapState;

    /**
     * オセロのマークをセットする時に、セット前のマップの状態で更新する
     * @param mark マーク
     * @param mapState セット前のマップの状態
     */
    public update(mark: MarkType, mapState: MapState) {
        if (mark === MarkType.BLACK) {
            this.blackMapState = mapState.clone();
        } else {
            this.whiteMapState = mapState.clone();
        }
    }

    /**
     * 一手戻るを使用した時の処理
     * 戻してカウントを行う
     * @param mark マーク
     * @param tilemap タイルマップ
     * @returns 
     */
    public takeBack(mark: MarkType, tilemap: Tilemap): void {
        const mapState = this.getMapStateByMark(mark);
        if (mapState === undefined) return;

        tilemap.mapState = mapState.clone();
        tilemap.update();

        this.countUp(mark);
        this.clear();
    }

    /**
     * 一手戻るを使用できるかどうかを返す
     * @param mark マーク
     * @returns 一手戻るを使用できる場合はtrue
     */
    public isTakeBackable(mark: MarkType): boolean {
        return this.getMapStateByMark(mark) !== undefined;
    }

    public getCountString(): string {
        return `（ 使用回数: 黒=${this.blackCount} / 白=${this.whiteCount} ）`;
    }

    /**
     * 指定したマークから一手前のマップの状態を返す
     * @param mark マーク
     * @returns 一手前のマップの状態
     */
    private getMapStateByMark(mark: MarkType): MapState | undefined {
        return mark === MarkType.BLACK
            ? this.blackMapState
            : this.whiteMapState;
    }

    /**
     * 指定したマークの一手戻るを使用した回数を1増やす
     * @param mark マーク
     */
    private countUp(mark: MarkType) {
        mark === MarkType.BLACK
            ? this.blackCount += 1
            : this.whiteCount += 1;
    }

    /**
     * 一手前のマップの状態を消す
     * 一手戻るを使用した場合に使用する
     */
    private clear() {
        this.blackMapState = undefined;
        this.whiteMapState = undefined;
    }
}