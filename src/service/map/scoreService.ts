import { Tilemap } from "../../entity/map/tilemap";
import { Param } from "../../param";
import { MarkType } from "../../type/markType";

/**
 * スコア表示サービス
 * 盤面の黒の数と白の数を表示する
 */
export class ScoreService {
    /**
     * スコア表示用のテキスト
     */
    private scoreText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        this.scoreText = scene.add.text(
            scene.cameras.main.width - 200,
            scene.cameras.main.height - Param.BOTTOM_TILE_MARGIN / 2,
            "黒: 0 / 白: 0"
        )

    }

    /**
     * スコアを更新する
     * @param tilemap タイルマップ
     */
    public update(tilemap: Tilemap) {
        const blackCount = tilemap.mapState.getMarkCount(MarkType.BLACK);
        const whiteCount = tilemap.mapState.getMarkCount(MarkType.WHITE);
        this.scoreText.setText(`黒: ${blackCount} / 白: ${whiteCount}`);
    }
}