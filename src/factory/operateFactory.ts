import { AlphaBetaImpl } from '../service/operate/impl/alphaBetaImpl';
import { ManualImpl } from '../service/operate/impl/manualImpl';
import { type OperateService } from '../service/operate/operateService';
import { OperateType } from '../type/operateType';

/**
 * 操作方法を生成するクラス
 */
export class OperateFactory {
    /**
     * 操作方法のマップ
     */
    private readonly MAP = new Map<OperateType, OperateService>();

    /**
     * 操作方法のマップを設定する
     * @param scene シーン
     */
    constructor(scene: Phaser.Scene) {
        this.MAP.set(OperateType.MANUAL, new ManualImpl(scene));
        this.MAP.set(OperateType.ALPHA_BETA, new AlphaBetaImpl());
    }

    /**
     * 操作方法を生成する
     * @param operateType 操作方法の種類
     * @returns 操作方法
     */
    public create(operateType: OperateType): OperateService {
        return this.MAP.get(operateType);
    }
}
