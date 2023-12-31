import { OperateType } from "../type/operateType";

/**
 * ゲームのタイトルシーン
 */
export class MenuScene extends Phaser.Scene {

    constructor() {
        super({ key: 'menuScene'});
    }

    preload() {
    }

    create() {
        const x = this.cameras.main.width / 2;
        this.createText(x, 100, '人 vs 人', OperateType.MANUAL, OperateType.MANUAL);
        this.createText(x, 200, '人 vs CP', OperateType.MANUAL, OperateType.ALPHA_BETA);
        this.createText(x, 300, 'CP vs 人', OperateType.ALPHA_BETA, OperateType.MANUAL);
        this.createText(x, 400, 'CP vs CP', OperateType.ALPHA_BETA, OperateType.ALPHA_BETA);
    }

    /**
     * テキストを生成して、クリック時のイベントを設定する
     * イベント：操作方法
     * @param x ワールドのｘ座標
     * @param y ワールドのｙ座標
     * @param content 表示内容
     * @param gameType ゲームタイプ
     */
    private createText(x: number, y: number, content: string, firstOperator: OperateType, secondOperator: OperateType): void {
        const text = this.add.text(x, y, content)
            .setOrigin(0.5)
            .setInteractive()
        text.on('pointerdown', () => {
            this.scene.start('playScene', { firstOperator: firstOperator, secondOperator: secondOperator });
        });
    }
}