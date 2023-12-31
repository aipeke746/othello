import { MarkType } from "../type/markType";

/**
 * マークをひっくり返す画像のキーを返すユーティリティクラス
 */
export class ReverseToMarkUtil {
    /**
     * 『白->黒』にひっくり返す画像のキー
     */
    public static readonly REVERSE_TO_BLACK: string = 'reverseToBlack';
    /**
     * 『黒->白』にひっくり返す画像のキー
     */
    public static readonly REVERSE_TO_WHITE: string = 'reverseToWhite';

    /**
     * 指定したマークのひっくり返す画像のキーを返す
     * @param markType 
     * @returns 
     */
    public static get(markType: MarkType): string {
        return markType === MarkType.BLACK ? 'reverseToBlack' : 'reverseToWhite';
    }

    /**
     * ひっくり返す画像のキーを全て返す
     * @returns 
     */
    public static getAll(): string[] {
        return ['reverseToBlack', 'reverseToWhite'];
    }
}