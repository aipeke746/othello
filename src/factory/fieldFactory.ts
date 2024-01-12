import { Field } from '../static/field';
import { FieldType } from '../type/fieldType';
import { MarkType } from '../type/markType';

/**
 * オセロのフィールドを生成するファクトリークラス
 */
export class FieldFactory {
    /**
     * オセロのフィールドを生成する
     * @param type オセロのフィールドの種類
     * @returns オセロのフィールド
     */
    public static create(type: FieldType): MarkType[][] {
        switch (type) {
            case FieldType.NORMAL:
                return this.getField(Field.NORMAL);
            case FieldType.CROSS:
                return this.getField(Field.CROSS);
            case FieldType.BATSU:
                return this.getField(Field.BATSU);
            case FieldType.MARU:
                return this.getField(Field.MARU);
            case FieldType.WIND_MILL:
                return this.getField(Field.WIND_MILL);
            case FieldType.NO_CORNERS:
                return this.getField(Field.NO_CORNERS);
            case FieldType.BLOCK1:
                return this.getField(Field.BLOCK1);
            case FieldType.BLOCK2:
                return this.getField(Field.BLOCK2);
            case FieldType.BLOCK3:
                return this.getField(Field.BLOCK3);
        }
    }

    /**
     * オセロのフィールドを取得する
     * （配列は参照渡しになるため、JSONを経由して値渡しにする）
     * @param field オセロのフィールド
     * @returns オセロのフィールド
     */
    public static getField(field: Field) {
        return JSON.parse(JSON.stringify(field));
    }
}
