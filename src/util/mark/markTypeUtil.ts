import { MarkType } from '../../type/markType';

/**
 * オセロのマークに関するユーティリティクラス
 */
export class MarkTypeUtil {
    public static readonly MARK_TYPE_MAP: Map<MarkType, string> = new Map<
        MarkType,
        string
    >([
        [MarkType.EMPTY, '空'],
        [MarkType.BLACK, '黒'],
        [MarkType.WHITE, '白'],
        [MarkType.NONE, 'なし'],
    ]);

    /**
     * 相手のマークを取得する
     * @param markType
     * @returns 相手のマーク
     */
    public static getOpponent(markType: MarkType): MarkType {
        if (markType == MarkType.EMPTY) {
            return MarkType.EMPTY;
        }

        return markType == MarkType.BLACK ? MarkType.WHITE : MarkType.BLACK;
    }

    /**
     * 指定したマークの文字列を返す
     * @param markType
     * @returns
     */
    public static getString(markType: MarkType): string {
        return this.MARK_TYPE_MAP.get(markType);
    }

    /**
     * 指定したマークの色を返す
     * @param markType
     * @returns
     */
    public static getColor(markType: MarkType): number {
        return markType === MarkType.BLACK ? 0x000000 : 0xffffff;
    }
}
