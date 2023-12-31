import { MarkType } from "../../type/markType";

/**
 * オセロのマークに関するユーティリティクラス
 */
export class MarkTypeUtil {
    /**
     * 相手のマークを取得する
     * @param markType 
     * @returns 相手のマーク
     */
    public static getOpponent(markType: MarkType): MarkType {
        if (markType == MarkType.NONE) {
            return MarkType.NONE;
        }

        return markType == MarkType.BLACK
            ? MarkType.WHITE
            : MarkType.BLACK;
    }
}