import { Field } from '../static/field';
import { FieldType } from '../type/fieldType';
import { MarkType } from '../type/markType';

/**
 * オセロのフィールドを生成するファクトリークラス
 */
export class FieldFactory {
    /**
     * オセロのフィールドのマップ
     */
    private readonly MAP = new Map<FieldType, MarkType[][]>();

    /**
     * オセロのフィールドのマップを設定する
     */
    constructor() {
        this.MAP.set(FieldType.NORMAL, Field.NORMAL);
        this.MAP.set(FieldType.CROSS, Field.CROSS);
        this.MAP.set(FieldType.BATSU, Field.BATSU);
        this.MAP.set(FieldType.MARU, Field.MARU);
        this.MAP.set(FieldType.WIND_MILL, Field.WIND_MILL);
        this.MAP.set(FieldType.NO_CORNERS, Field.NO_CORNERS);
        this.MAP.set(FieldType.BLOCK1, Field.BLOCK1);
        this.MAP.set(FieldType.BLOCK2, Field.BLOCK2);
        this.MAP.set(FieldType.BLOCK3, Field.BLOCK3);
    }

    /**
     * オセロのフィールドを生成する
     * @param type オセロのフィールドの種類
     * @returns オセロのフィールド
     */
    public create(type: FieldType): MarkType[][] {
        const field = this.MAP.get(type);
        return this.getField(field);
    }

    /**
     * オセロのフィールドを取得する
     * （配列は参照渡しになるため、JSONを経由して値渡しにする）
     * @param field オセロのフィールド
     * @returns オセロのフィールド
     */
    public getField(field: Field): MarkType[][] {
        return JSON.parse(JSON.stringify(field));
    }
}
