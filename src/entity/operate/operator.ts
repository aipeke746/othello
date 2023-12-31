import { OperateFactory } from "../../factory/operateFactory";
import { OperateService } from "../../service/operate/operateService";
import { OperateType } from "../../type/operateType";

/**
 * 操作方法をまとめたクラス
 */
export class Operator {
    /**
     * 操作方法
     */
    private operateType: OperateType;
    /**
     * 操作方法のサービス
     */
    private operateService: OperateService;

    /**
     * コンストラクタ
     * @param scene シーン
     * @param operateType 操作方法
     */
    constructor(scene: Phaser.Scene, operateType: OperateType) {
        this.operateType = operateType;
        this.operateService = OperateFactory.create(scene, operateType);
    }

    /**
     * 操作方法のサービスを取得する
     * @returns 操作方法
     */
    public getOperateService(): OperateService {
        return this.operateService;
    }

    /**
     * 手動操作かどうかを取得する
     * @returns 手動操作かどうか
     */
    public isManual(): boolean {
        return this.operateType === OperateType.MANUAL;
    }
}