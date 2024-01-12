import { Tilemap } from '../entity/map/tilemap';
import { Param } from '../static/param';
import { FieldType } from '../type/fieldType';
import { OperateType } from '../type/operateType';
import { FieldTypeUtil } from '../util/map/fieldTypeUtil';
import { OperateTypeUtil } from '../util/operate/operateTypeUtil';
import { TextUtil } from '../util/scene/textUtil';
import { TweenUtil } from '../util/scene/tweenUtil';

/**
 * ゲームのメニューシーン
 */
export class MenuScene extends Phaser.Scene {
    private readonly FONT_SIZE = 30;

    private firstOperateType: OperateType = OperateType.MANUAL;
    private secondOperateType: OperateType = OperateType.ALPHA_BETA;
    private fieldType: FieldType = FieldType.NORMAL;
    private fieldTypeText: Phaser.GameObjects.Text;
    private tilemap: Tilemap;

    constructor() {
        super({ key: 'menuScene' });
    }

    preload() {
        this.load.image('mapTiles', 'asset/image/mapTiles.png');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.createTitleText(centerX, 100, 'オセロゲーム');

        // フィールドを選択
        this.fieldTypeText = TextUtil.createText(
            this,
            centerX,
            centerY - 200,
            this.fieldType,
            this.FONT_SIZE
        );
        this.createNextFieldType(centerX + 150, centerY - 200);
        this.createPreviouseFieldType(centerX - 150, centerY - 200);

        // 選択フィールドのマップを表示
        this.tilemap = new Tilemap(this, 'mapTiles');
        this.tilemap.setPosition(180, centerY - 150);
        this.tilemap.setScale(0.4);

        // 先攻・後攻の操作方法を選択
        this.createFirstOperateText(centerX, centerY + 130);
        this.createSecondOperateText(centerX, centerY + 200);

        // 音楽をかけるかどうか
        this.createMusicText(centerX, this.cameras.main.height - 130);

        // ゲームスタートボタン
        this.createStartText(
            centerX,
            this.cameras.main.height - 50,
            'ゲームスタート'
        );
    }

    /**
     * 画面に表示するタイトル文字の作成
     * @param x ｘ座標
     * @param y y座標
     * @param content 表示する文字列
     */
    private createTitleText(x: number, y: number, content: string): void {
        TextUtil.createText(this, x, y, content, this.FONT_SIZE * 2);
    }

    /**
     * 次のフィールドを表示
     * @param x ｘ座標
     * @param y ｙ座標
     */
    private createNextFieldType(x: number, y: number): void {
        TextUtil.createTextButton(this, x, y, '▶︎', this.FONT_SIZE).on(
            'pointerdown',
            () => {
                this.fieldType = FieldTypeUtil.getNext(this.fieldType);
                this.fieldTypeText.setText(this.fieldType);
                this.tilemap.mapState.setField(this.fieldType);
                this.tilemap.update();
            }
        );
    }

    /**
     * 前のフィールドを表示
     * @param x ｘ座標
     * @param y ｙ座標
     */
    private createPreviouseFieldType(x: number, y: number): void {
        TextUtil.createTextButton(this, x, y, '◀︎', this.FONT_SIZE).on(
            'pointerdown',
            () => {
                this.fieldType = FieldTypeUtil.getPrevious(this.fieldType);
                this.fieldTypeText.setText(this.fieldType);
                this.tilemap.mapState.setField(this.fieldType);
                this.tilemap.update();
            }
        );
    }

    /**
     * 先攻の操作タイプの選択ができる文字を作成
     * @param x ｘ座標
     * @param y ｙ座標
     */
    private createFirstOperateText(x: number, y: number): void {
        const text = TextUtil.createTextButton(
            this,
            x,
            y,
            `先攻（黒）: ${OperateTypeUtil.getString(this.firstOperateType)}`,
            this.FONT_SIZE
        ).on('pointerdown', () => {
            this.firstOperateType = OperateTypeUtil.getOpposition(
                this.firstOperateType
            );
            text.setText(
                `先攻（黒）: ${OperateTypeUtil.getString(
                    this.firstOperateType
                )}`
            );
        });
    }

    /**
     * 後攻の操作タイプの選択ができる文字を作成
     * @param x ｘ座標
     * @param y ｙ座標
     */

    private createSecondOperateText(x: number, y: number): void {
        const text = TextUtil.createTextButton(
            this,
            x,
            y,
            `後攻（白）: ${OperateTypeUtil.getString(this.secondOperateType)}`,
            this.FONT_SIZE
        ).on('pointerdown', () => {
            this.secondOperateType = OperateTypeUtil.getOpposition(
                this.secondOperateType
            );
            text.setText(
                `後攻（白）: ${OperateTypeUtil.getString(
                    this.secondOperateType
                )}`
            );
        });
    }

    /**
     * 音楽を再生するかどうかを選択できる文字を作成
     * @param x ｘ座標
     * @param y ｙ座標
     */
    private createMusicText(x: number, y: number): void {
        const isPlay: string = Param.PLAY_MUSIC ? ' ON' : 'OFF';
        const text = TextUtil.createTextButton(
            this,
            x,
            y,
            `音楽再生: ${isPlay}`,
            25
        ).on('pointerdown', () => {
            Param.PLAY_MUSIC = !Param.PLAY_MUSIC;
            const isPlay: string = Param.PLAY_MUSIC ? ' ON' : 'OFF';
            text.setText(`音楽再生: ${isPlay}`);
        });
    }

    /**
     * ゲームをスタートする文字を作成
     * @param x ｘ座標
     * @param y ｙ座標
     * @param content 表示する文字列
     */
    private createStartText(x: number, y: number, content: string): void {
        const text = TextUtil.createTextButton(
            this,
            x,
            y,
            content,
            this.FONT_SIZE
        ).on('pointerdown', () => {
            Param.FIELD_TYPE = this.fieldType;
            this.scene.start('playScene', {
                firstOperateType: this.firstOperateType,
                secondOperateType: this.secondOperateType,
            });
        });
        TweenUtil.blinking(this, text, 1000);
    }
}
