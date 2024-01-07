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
        this.createText(centerX, centerY, this.winner, 50);

        // 閉じるボタン
        this.createText(centerX + 150, centerY + 80, "閉じる", 20)
            .on('pointerdown', () => {
                this.scene.stop('finishScene');
            })
    }

    /**
     * 文字を作成する
     * @param x ｘ座標
     * @param y ｙ座標
     * @param content 表示する文字列
     * @param fontSize 文字の大きさ
     * @returns 作成した文字
     */
    private createText(x: number, y: number, content: string, fontSize: number): Phaser.GameObjects.Text {
        return this.add.text(x, y, content)
            .setOrigin(0.5)
            .setFontSize(fontSize)
            .setInteractive();
    }
}