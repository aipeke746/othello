import { Color } from "../../static/color";

/**
 * 文字を作成するユーティリティクラス
 */
export class TextUtil {
    /**
     * 文字を作成する
     * @param scene シーン
     * @param x 中央のｘ座標
     * @param y 中央のｙ座標
     * @param content 表示する文字列
     * @param fontSize 文字の大きさ
     * @returns 作成した文字
     */
    public static createText(scene: Phaser.Scene, x: number, y: number, content: string, fontSize: number, fontColor: string = Color.WHITE): Phaser.GameObjects.Text {
        return scene.add.text(x, y, content)
            .setOrigin(0.5)
            .setFontSize(fontSize)
            .setColor(fontColor);
    }

    /**
     * ボタン機能を持った文字を作成する
     * @param scene シーン
     * @param x 中央のｘ座標
     * @param y 中央のｙ座標
     * @param content 表示する文字列
     * @param fontSize 文字の大きさ
     * @returns 作成したボタン機能を持った文字
     */
    public static createTextButton(scene: Phaser.Scene, x: number, y: number, content: string, fontSize: number, fontColor: string = Color.WHITE): Phaser.GameObjects.Text {
        return this.createText(scene, x, y, content, fontSize, fontColor)
            .setInteractive();
    }
}