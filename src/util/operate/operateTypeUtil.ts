import { OperateType } from "../../type/operateType";

/**
 * 操作タイプに関連するユーティリティクラス
 */
export class OperateTypeUtil {
    /**
     * 操作タイプと画面に表示する文字列のマップ
     */
    public static readonly OPERATE_TYPE_MAP: Map<OperateType, string> = new Map<OperateType, string>([
        [OperateType.MANUAL, 'MANUAL'],
        [OperateType.ALPHA_BETA, '  AUTO'],
    ]);

    /**
     * 指定した操作タイプの文字列を返す
     * @param operateType 操作タイプ
     * @returns 操作タイプの文字列
     */
    public static getString(operateType: OperateType): string {
        return OperateTypeUtil.OPERATE_TYPE_MAP.get(operateType);
    }

    /**
     * 指定した操作タイプの反対の操作タイプを返す
     * @param operateType 操作タイプ
     * @returns 反対の操作タイプ
     */
    public static getOpposition(operateType: OperateType): OperateType {
        return operateType === OperateType.MANUAL
            ? OperateType.ALPHA_BETA
            : OperateType.MANUAL;
    }
}