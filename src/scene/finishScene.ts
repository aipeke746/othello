import { TextUtil } from "../util/scene/textUtil";

export class FinishScene extends Phaser.Scene {
    /**
     * 勝者の文字列
     */
    private winner: string;

    constructor() {
        super({ key: 'finishScene' });
    }

    init(data: any) {
        this.winner = data.winner as string;
    }

    preload() {
        this.load.image('frame', 'asset/image/frame.png');
    }

    create() {
        // 枠の表示
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.width / 2;
        this.add.image(centerX, centerY, "frame");

        // 勝敗表示
        TextUtil.createText(this, centerX, centerY, this.winner, 50);

        // 閉じるボタン
        TextUtil.createTextButton(this, centerX + 150, centerY + 80, "閉じる", 20)
            .on('pointerdown', () => {
                this.scene.stop('finishScene');
            })
    }
}