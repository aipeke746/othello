import { Tilemap } from '../../entity/map/tilemap';
import { OperateManager } from '../../entity/operate/operateManager';
import { Color } from '../../static/color';
import { Param } from '../../static/param';
import { MarkType } from '../../type/markType';
import { TextUtil } from '../../util/scene/textUtil';
import { AssistService } from './assistService';
import { TakeBackService } from './takeBackService';

/**
 * 機能表示用のサービス
 *
 * ゲームのプレイ中に機能の切り替えや実行を管理する
 */
export class FunctionService {
    /**
     * 文字のサイズ
     */
    private readonly FONT_SIZE = 20;
    /**
     * 文字のカラー
     */
    private readonly FONT_COLOR = Color.BLACK;
    /**
     * 背景の色
     */
    private readonly BACKGROUND_COLOR = Color.GRAY;

    /**
     * シーン
     */
    private scene: Phaser.Scene;
    /**
     * アシスト表示用のテキスト
     * ON/OFFの切り替えを行う
     */
    private assistTextToggle: Phaser.GameObjects.Text;
    /**
     * 一手戻る用のテキストボタン
     * 一手戻ることができない場合は半透明の状態で表示する
     */
    private takeBackTextButton: Phaser.GameObjects.Text;
    /**
     * 一手戻るを使用した回数を表示
     */
    private takeBackCountText: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        tilemap: Tilemap,
        assistService: AssistService,
        operateManager: OperateManager,
        takeBackService: TakeBackService,
        music: Phaser.Sound.BaseSound
    ) {
        this.scene = scene;

        // 手番表示用の背景
        const x = Param.TILE_MARGIN;
        const y = scene.cameras.main.height - Param.BOTTOM_TILE_MARGIN;
        const width = scene.cameras.main.width / 2 - x - Param.TILE_MARGIN / 2;
        const height = scene.cameras.main.height - y - Param.TILE_MARGIN;
        scene.add
            .rectangle(x, y, width, height, this.BACKGROUND_COLOR)
            .setOrigin(0, 0);

        let tx, ty;

        // アシスト機能の切り替えボタン
        tx = x + width / 2;
        ty = y + height / 2 - Param.BOTTOM_TILE_MARGIN / 5;
        this.createAssistText(tilemap, assistService, operateManager, tx, ty);

        // 一手戻るボタン
        tx = x + width / 2;
        ty = y + height / 2;
        this.createTakeBackText(
            tilemap,
            operateManager,
            takeBackService,
            tx,
            ty
        );

        // メニュー画面への遷移ボタン
        tx = x + 60;
        ty = scene.cameras.main.height - Param.TILE_MARGIN - 20;
        this.createBackMenuText(tx, ty, music);
    }

    /**
     * 更新
     * @param tilemap タイルマップ
     * @param takeBackService 一手戻るサービス
     */
    public update(tilemap: Tilemap, takeBackService: TakeBackService): void {
        const nowTurnMark: MarkType = tilemap.mapState.getNowTurnMark();
        const canTakeBack: boolean =
            takeBackService.isTakeBackable(nowTurnMark);
        const alpha: number = canTakeBack ? 1.0 : 0.3;
        this.takeBackTextButton.setAlpha(alpha);
        this.takeBackCountText.setText(`${takeBackService.getCountString()}`);
    }

    /**
     * アシスト表示用のテキストを作成（トグルボタン）
     * @param tilemap タイルマップ
     * @param assistService アシストサービス
     * @param operateManager 操作方法の管理
     * @param tx 表示する文字中央のｘ座標
     * @param ty 表示する文字中央のｙ座標
     */
    private createAssistText(
        tilemap: Tilemap,
        assistService: AssistService,
        operateManager: OperateManager,
        tx: number,
        ty: number
    ) {
        this.assistTextToggle = TextUtil.createTextButton(
            this.scene,
            tx,
            ty,
            this.getAssistString(),
            this.FONT_SIZE,
            this.FONT_COLOR
        ).on('pointerdown', () => {
            Param.SHOW_PUTABLE_CIRCLES = !Param.SHOW_PUTABLE_CIRCLES;
            if (Param.SHOW_PUTABLE_CIRCLES) {
                assistService.showPutableCoords(
                    tilemap,
                    operateManager.isManual(tilemap.mapState.getNowTurnMark())
                );
                this.assistTextToggle.setText(this.getAssistString());
            } else {
                assistService.removeAllCircle();
                this.assistTextToggle.setText(this.getAssistString());
            }
        });
    }

    /**
     * 一手戻る表示用のテキストを作成（ボタン）
     * @param tilemap タイルマップ
     * @param operateManager 操作方法の管理
     * @param takeBackService 一手戻るサービス
     * @param tx 表示する文字中央のｘ座標
     * @param ty 表示する文字中央のｙ座標
     */
    private createTakeBackText(
        tilemap: Tilemap,
        operateManager: OperateManager,
        takeBackService: TakeBackService,
        tx: number,
        ty: number
    ) {
        this.takeBackTextButton = TextUtil.createTextButton(
            this.scene,
            tx,
            ty,
            '一手戻る',
            this.FONT_SIZE,
            this.FONT_COLOR
        ).on('pointerdown', () => {
            const nowTurnMark = tilemap.mapState.getNowTurnMark();
            if (operateManager.isManual(nowTurnMark)) {
                takeBackService.takeBack(nowTurnMark, tilemap);
            }
        });
        this.takeBackCountText = TextUtil.createText(
            this.scene,
            tx,
            ty + 25,
            `${takeBackService.getCountString()}`,
            this.FONT_SIZE - 5,
            this.FONT_COLOR
        );
    }

    /**
     * メニュー画面に戻る用のテキストを作成（ボタン）
     * @param tx 表示する文字左上のｘ座標
     * @param ty 表示する文字左上のｙ座標
     * @param music 音楽
     */
    private createBackMenuText(
        tx: number,
        ty: number,
        music: Phaser.Sound.BaseSound
    ): void {
        TextUtil.createTextButton(
            this.scene,
            tx,
            ty,
            '⇦Menu画面',
            this.FONT_SIZE,
            this.FONT_COLOR
        ).on('pointerdown', () => {
            music.stop();
            this.scene.scene.stop('finishScene');
            this.scene.scene.start('menuScene');
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
}
