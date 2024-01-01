import { Tilemap } from "../../entity/map/tilemap";
import { Param } from "../../param";
import { MarkType } from "../../type/markType";
import { MarkTypeUtil } from "../../util/mark/markTypeUtil";

/**
 * スコア・ターン表示サービス
 * 盤面の黒の数と白の数を表示する
 */
export class ViewService {
    /**
     * 文字の大きさ
     */
    private readonly fontSize = 30;
    /**
     * 円の半径
     */
    private readonly circleRadius = 20;
    /**
     * テキストのオフセット
     */
    private readonly offset = 20;

    /**
     * 手番表示用のテキスト
     */
    private turnText: Phaser.GameObjects.Text;
   /**
    * 黒のスコア表示用のテキスト
    */
    private blackScoreText: Phaser.GameObjects.Text;
    /**
     * 白のスコア表示用のテキスト
     */
    private whiteScoreText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        // 背景
        const x = scene.cameras.main.width / 2 + Param.TILE_MARGIN;
        const y = scene.cameras.main.height - Param.BOTTOM_TILE_MARGIN;``
        const width = scene.cameras.main.width - x - Param.TILE_MARGIN / 2;
        const height = scene.cameras.main.height - y - Param.TILE_MARGIN;
        scene.add.rectangle(x, y, width, height, 0xbdbebd).setOrigin(0, 0);

        let tx, ty;

        // 手番表示用のテキスト
        tx = x + width / 2;
        ty = y + height / 2 - Param.BOTTOM_TILE_MARGIN / 4;
        this.turnText = this.createText(scene, tx, ty, "黒のターン");

        // 黒のスコア表示用のテキスト
        tx = x + width / 2 + this.offset;
        ty = y + height / 2;
        this.blackScoreText = this.createText(scene, tx, ty, ":  2");
        scene.add.graphics().fillStyle(0x000000).fillCircle(tx - 70, ty, this.circleRadius);

        // 白のスコア表示用のテキスト
        tx = x + width / 2 + this.offset;
        ty = y + height / 2 + Param.BOTTOM_TILE_MARGIN / 4;
        this.whiteScoreText = this.createText(scene, tx, ty, ":  2");
        scene.add.graphics().fillStyle(0xffffff).fillCircle(tx - 70, ty, this.circleRadius);
    }

    /**
     * スコアを更新する
     * @param tilemap タイルマップ
     */
    public update(tilemap: Tilemap) {
        this.turnText.setText(this.getTurnString(tilemap));
        this.blackScoreText.setText(this.getMarkCountString(tilemap, MarkType.BLACK));
        this.whiteScoreText.setText(this.getMarkCountString(tilemap, MarkType.WHITE));
    }

    /**
     * テキストを作成する
     * @param scene シーン
     * @param x x座標
     * @param y y座標
     * @param text テキスト
     * @returns テキスト
     */
    private createText(scene: Phaser.Scene, x: number, y: number, text: string): Phaser.GameObjects.Text {
        return scene.add.text(x, y, text)
            .setFontSize(this.fontSize)
            .setColor('#000000')
            .setOrigin(0.5, 0.5);
    }

    /**
     * マークの数の文字列表示を取得する
     * @param tilemap タイルマップ
     * @param mark マーク
     * @returns マークの数の文字列表示
     */
    private getMarkCountString(tilemap: Tilemap, mark: MarkType): string {
        const count = tilemap.mapState.getMarkCount(mark);
        return ": " + count.toString().padStart(2, ' ');
    }

    /**
     * 手番の文字列を取得する
     * @param tilemap タイルマップ
     * @returns 手番の文字列
     */
    private getTurnString(tilemap: Tilemap): string {
        const mark = tilemap.mapState.getNowTurnMark();
        return `${MarkTypeUtil.getString(mark)}のターン`;
    }
}