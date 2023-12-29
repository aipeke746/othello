export class Param {
    /**
     * タイルマップ（オセロの盤面）の周りの余白
     */
    public static readonly TILE_MARGIN: number = 30;
    /**
     * タイルマップ（オセロの盤面）の下の余白
     * 現在のターンやスコアを表示するための余白
     */
    public static readonly BOTTOM_TILE_MARGIN: number = 250;
    /**
     * オセロのマークを置ける場所を表示するかどうか
     * 対象の操作方法： 手動操作（MANUAL）
     */
    public static readonly SHOW_PUTABLE_CIRCLES: boolean = true;
}