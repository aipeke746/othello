import { ManualImpl } from "../service/operate/impl/manualImpl";
import { MiniMaxImpl } from "../service/operate/impl/miniMaxImpl";
import { OperateType } from "../type/operateType";

/**
 * 操作方法を生成するクラス
 */
export class OperateFactory {
    /**
     * 操作方法を生成する
     * @param scene シーン
     * @param operateType 操作方法の種類
     * @returns 操作方法
     */
    static create(scene: Phaser.Scene, operateType: OperateType) {
        switch (operateType) {
            case OperateType.MANUAL:
                return new ManualImpl(scene);
            case OperateType.MINIMAX:
                return new MiniMaxImpl();
            default:
                throw new Error('OperateFactory: OperateType not found.');
        }
    }
}