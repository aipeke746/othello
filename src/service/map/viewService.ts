import { Tilemap } from '../../entity/map/tilemap';
import { Color } from '../../static/color';
import { Param } from '../../static/param';
import { MarkType } from '../../type/markType';
import { MarkTypeUtil } from '../../util/mark/markTypeUtil';
import { TextUtil } from '../../util/scene/textUtil';

/**
 * スコア・ターン表示サービス
 *
 * オセロのフィールドの黒の数と白の数を表示する
 * 現在のターンを表示する
 */
export class ViewService {
    /**
     * 文字の大きさ
     */
    private readonly FONT_SIZE = 30;
    /**
     * 文字の色
     */
    private readonly FONT_COLOR = Color.BLACK;
    /**
     * 背景の色
     */
    private readonly BACKGROUND_COLOR = Color.GRAY;
    /**
     * 円の半径
     */
    private readonly RADIUS = 20;
    /**
     * テキストのオフセット
     */
    private readonly OFFSET = 20;

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
        const y = scene.cameras.main.height - Param.BOTTOM_TILE_MARGIN;
        const width = scene.cameras.main.width - x - Param.TILE_MARGIN;
        const height = scene.cameras.main.height - y - Param.TILE_MARGIN;
        scene.add
            .rectangle(x, y, width, height, this.BACKGROUND_COLOR)
            .setOrigin(0, 0);

        let tx, ty;

        // 手番表示用のテキスト
        tx = x + width / 2;
        ty = y + height / 2 - Param.BOTTOM_TILE_MARGIN / 4;
        this.turnText = TextUtil.createText(
            scene,
            tx,
            ty,
            '黒のターン',
            this.FONT_SIZE,
            this.FONT_COLOR
        );

        // 黒のスコア表示用のテキスト
        tx = x + width / 2 + this.OFFSET;
        ty = y + height / 2;
        this.blackScoreText = TextUtil.createText(
            scene,
            tx,
            ty,
            ':  2',
            this.FONT_SIZE,
            this.FONT_COLOR
        );
        scene.add
            .graphics()
            .fillStyle(0x000000)
            .fillCircle(tx - 70, ty, this.RADIUS);

        // 白のスコア表示用のテキスト
        tx = x + width / 2 + this.OFFSET;
        ty = y + height / 2 + Param.BOTTOM_TILE_MARGIN / 4;
        this.whiteScoreText = TextUtil.createText(
            scene,
            tx,
            ty,
            ':  2',
            this.FONT_SIZE,
            this.FONT_COLOR
        );
        scene.add
            .graphics()
            .fillStyle(0xffffff)
            .fillCircle(tx - 70, ty, this.RADIUS);
    }

    /**
     * スコアを更新する
     * @param tilemap タイルマップ
     */
    public update(tilemap: Tilemap) {
        this.turnText.setText(this.getTurnString(tilemap));
        this.blackScoreText.setText(
            this.getMarkCountString(tilemap, MarkType.BLACK)
        );
        this.whiteScoreText.setText(
            this.getMarkCountString(tilemap, MarkType.WHITE)
        );
    }

    /**
     * マークの数の文字列表示を取得する
     * @param tilemap タイルマップ
     * @param mark マーク
     * @returns マークの数の文字列表示
     */
    private getMarkCountString(tilemap: Tilemap, mark: MarkType): string {
        const count = tilemap.mapState.getMarkCount(mark);
        return ': ' + count.toString().padStart(2, ' ');
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
