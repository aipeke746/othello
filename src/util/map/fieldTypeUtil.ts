import { FieldType } from '../../type/fieldType';

/**
 * フィールドタイプのユーティリティクラス
 *
 * メニュー画面でフィールドタイプを切り替える際に使用する
 */
export class FieldTypeUtil {
    /**
     * 全種類のフィールドタイプの配列
     */
    private static readonly FIELD_TYPS: FieldType[] = Object.values(FieldType);
    /**
     * フィールドタイプの全数
     */
    private static readonly TOTAL_ELEMENT_COUNT = Object.keys(FieldType).length;

    /**
     * 次のフィールドタイプを取得する
     * @param fieldType 現在表示しているフィールドタイプ
     * @returns 次のフィールドタイプ
     */
    public static getNext(fieldType: FieldType): FieldType {
        const currentIndex: number = this.getCurrentIndex(fieldType);
        const nextIndex: number =
            (currentIndex + 1) % FieldTypeUtil.TOTAL_ELEMENT_COUNT;

        return FieldTypeUtil.FIELD_TYPS[nextIndex];
    }

    /**
     * 前のフィールドタイプを取得する
     * @param fieldType 現在表示しているフィールドタイプ
     * @returns 前のフィールドタイプ
     */
    public static getPrevious(fieldType: FieldType): FieldType {
        const currentIndex: number = this.getCurrentIndex(fieldType);
        const previousIndex: number =
            (currentIndex - 1 + FieldTypeUtil.TOTAL_ELEMENT_COUNT) %
            FieldTypeUtil.TOTAL_ELEMENT_COUNT;

        return FieldTypeUtil.FIELD_TYPS[previousIndex];
    }

    /**
     * 現在表示しているフィールドタイプの要素数を取得する
     * @param fieldType 現在表示しているフィールドタイプ
     * @returns フィールドタイプの要素数
     */
    private static getCurrentIndex(fieldType): number {
        return FieldTypeUtil.FIELD_TYPS.indexOf(fieldType);
    }
}
