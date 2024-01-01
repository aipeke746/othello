import { Tilemap } from "../../entity/map/tilemap";
import { OperateManager } from "../../entity/operate/operateManager";
import { Param } from "../../param";
import { AssistService } from "./assistService";

export class FunctionService {
    /**
     * 文字のサイズ
     */
    private readonly FONT_SIZE = 20;
    /**
     * 文字のカラー
     */
    private readonly FONT_COLOR = '#000000';
    /**
     * アシスト表示用のテキスト
     */
    private assistText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, tilemap: Tilemap, assistService: AssistService, operateManager: OperateManager) {
        // 手番表示用の背景
        const x = Param.TILE_MARGIN;
        const y = scene.cameras.main.height - Param.BOTTOM_TILE_MARGIN;
        const width = scene.cameras.main.width / 2 - x - Param.TILE_MARGIN / 2;
        const height = scene.cameras.main.height - y - Param.TILE_MARGIN;
        scene.add.rectangle(x, y, width, height, 0xbdbebd).setOrigin(0, 0);

        let tx, ty;

        // アシスト機能の切り替えボタン
        tx = x + width / 2;
        ty = y + height / 2 - Param.BOTTOM_TILE_MARGIN / 5;
        this.assistText = this.createText(scene, tx, ty, 0.5, this.getAssistString())
            .on('pointerdown', () => {
                Param.SHOW_PUTABLE_CIRCLES = !Param.SHOW_PUTABLE_CIRCLES;
                if (Param.SHOW_PUTABLE_CIRCLES) {
                    assistService.showPutableCoords(tilemap, operateManager.isManual(tilemap.mapState.getNowTurnMark()));
                    this.assistText.setText(this.getAssistString());
                } else {
                    assistService.removeAllCircle();
                    this.assistText.setText(this.getAssistString());
                }
            });

        // メニュー画面への遷移ボタン
        tx = x + 10;
        ty = scene.cameras.main.height - Param.TILE_MARGIN - 30;
        this.createText(scene, tx, ty, 0, '⇦Menu画面')
            .on('pointerdown', () => {
                scene.scene.start('menuScene');
            });
    }

    /**
     * アシスト表示の文字列を取得する
     */
    private getAssistString(): string {
        return Param.SHOW_PUTABLE_CIRCLES
            ? 'アシスト表示:  ON'
            : 'アシスト表示: OFF';
    }

    /**
     * テキストを作成する
     * @param scene シーン
     * @param x x座標
     * @param y y座標
     * @param origin 原点
     * @param text テキスト
     */
    private createText(scene: Phaser.Scene, x: number, y: number, origin: number, text: string) {
        return scene.add.text(x, y, text)
            .setFontSize(this.FONT_SIZE)
            .setColor(this.FONT_COLOR)
            .setOrigin(origin)
            .setInteractive()
    }
}

