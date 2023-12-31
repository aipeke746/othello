import { OperateService } from "../../service/operate/operateService";
import { MarkType } from "../../type/markType";
import { OperateType } from "../../type/operateType";
import { Operator } from "./operator";

/**
 * オセロの黒、白の操作方法を管理するクラス
 */
export class OperateManager {
    /**
     * 操作方法
     */
    private operators: Map<MarkType, Operator> = new Map();

    /**
     * コンストラクタ
     * @param scene シーン
     * @param blackType 黒の操作方法
     * @param whiteType 白の操作方法
     */
    constructor(scene: Phaser.Scene, blackType: OperateType, whiteType: OperateType) {
        this.operators.set(MarkType.BLACK, new Operator(scene, blackType));
        this.operators.set(MarkType.WHITE, new Operator(scene, whiteType));
    }

    /**
     * 操作方法を取得する
     * @param mark マーク
     * @returns 操作方法
     */
    public isManual(mark: MarkType): boolean {
        if (this.inValidMarkType(mark)) {
            throw new Error("Invalid mark type: NONE");
        }

        return this.getOperator(mark).isManual();
    }

    /**
     * 指定したマークの操作方法のサービスを取得する
     * @param mark マーク
     * @returns 操作方法のサービス
     */
    public getOperateService(mark: MarkType): OperateService {
        if (this.inValidMarkType(mark)) {
            throw new Error("Invalid mark type: NONE");
        }

        return this.getOperator(mark).getOperateService();
    }

    /**
     * マークが無効かどうかを判定する
     * @param mark マーク
     * @returns マークが無効かどうか
     */
    private inValidMarkType(mark: MarkType): boolean {
        return mark === MarkType.NONE;
    }

    /**
     * 指定したマークの操作方法を取得する
     * @param mark マーク
     * @returns 操作方法
     */
    private getOperator(mark: MarkType): Operator {
        const operator = this.operators.get(mark);
        if (!operator) {
            throw new Error(`No operator found for mark type: ${mark}`);
        }

        return operator;
    }
}
