import { Tilemap } from "../entity/map/tilemap";
import { Param } from "../static/param";
import { FieldType } from '../type/fieldType';
import { OperateType } from "../type/operateType";
import { FieldTypeUtil } from "../util/map/fieldTypeUtil";
import { OperateTypeUtil } from "../util/operate/operateTypeUtil";

/**
 * ゲームのタイトルシーン
 */
export class MenuScene extends Phaser.Scene {
    private readonly FONT_SIZE = 30;

    private firstOperateType: OperateType = OperateType.MANUAL;
    private secondOperateType: OperateType = OperateType.ALPHA_BETA;
    private fieldType: FieldType = FieldType.NORMAL;
    private fieldTypeText: Phaser.GameObjects.Text;
    private tilemap: Tilemap

    constructor() {
        super({ key: 'menuScene'});
    }

    preload() {
        this.load.image('mapTiles', 'assets/images/mapTiles.png');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.createTitleText(centerX, 100, 'オセロゲーム');

        // フィールドを選択
        this.fieldTypeText = this.createText(centerX, centerY - 200, this.fieldType)
        this.createNextFieldType(centerX + 150, centerY - 200);
        this.createPreviouseFieldType(centerX - 150, centerY - 200);

        // 選択フィールドのマップを表示
        this.tilemap = new Tilemap(this, 'mapTiles')
        this.tilemap.setPosition(180, centerY - 150);
        this.tilemap.setScale(0.4);

        // 先攻・後攻の操作方法を選択
        this.createFirstOperateText(centerX, centerY + 130);
        this.createSecondOperateText(centerX, centerY + 200);
        this.createStartText(centerX, this.cameras.main.height - 100, 'ゲームスタート');
    }

    /**
     * 画面に表示するタイトル文字の作成
     * @param x ｘ座標
     * @param y y座標
     * @param content 表示する文字列
     */
    private createTitleText(x: number, y: number, content: string): void {
        this.createText(x, y, content, this.FONT_SIZE * 2)
    }

    /**
     * 次のフィールドを表示
     * @param x ｘ座標
     * @param y ｙ座標
     */
    private createNextFieldType(x: number, y: number): void {
        this.createText(x, y, "▶️")
            .on('pointerdown', () => {
                this.fieldType = FieldTypeUtil.getNext(this.fieldType);
                this.fieldTypeText.setText(this.fieldType);
                this.tilemap.mapState.setField(this.fieldType);
                this.tilemap.update();
            })
    }

    /**
     * 前のフィールドを表示
     * @param x ｘ座標
     * @param y ｙ座標
     */
    private createPreviouseFieldType(x: number, y: number): void {
        this.createText(x, y, "◀️")
            .on('pointerdown', () => {
                this.fieldType = FieldTypeUtil.getPrevious(this.fieldType);
                this.fieldTypeText.setText(this.fieldType);
                this.tilemap.mapState.setField(this.fieldType);
                this.tilemap.update();
            })
    }

    /**
     * 先攻の操作タイプの選択ができる文字を作成
     * @param x ｘ座標
     * @param y ｙ座標
     */
    private createFirstOperateText(x: number, y: number): void {
        const text = this.createText(x, y, "先手: " + OperateTypeUtil.getString(this.firstOperateType))
            .on('pointerdown', () => {
                this.firstOperateType = OperateTypeUtil.getOpposition(this.firstOperateType);
                text.setText("先手: " + OperateTypeUtil.getString(this.firstOperateType));
            });
    }

    /**
     * 後攻の操作タイプの選択ができる文字を作成
     * @param x ｘ座標
     * @param y ｙ座標
     */

    private createSecondOperateText(x: number, y: number): void {
        const text = this.createText(x, y, "後手: " + OperateTypeUtil.getString(this.secondOperateType))
            .on('pointerdown', () => {
                this.secondOperateType = OperateTypeUtil.getOpposition(this.secondOperateType);
                text.setText("後手: " + OperateTypeUtil.getString(this.secondOperateType));
            });
    }

    /**
     * ゲームをスタートする文字を作成
     * @param x ｘ座標
     * @param y ｙ座標
     * @param content 表示する文字列
     */
    private createStartText(x: number, y: number, content: string): void {
        this.createText(x, y, content)
            .on('pointerdown', () => {
                Param.FIELD_TYPE = this.fieldType;
                this.scene.start('playScene', { firstOperateType: this.firstOperateType, secondOperateType: this.secondOperateType });
            });
    }

    /**
     * 文字を作成する
     * @param x ｘ座標
     * @param y ｙ座標
     * @param content 表示する文字列
     * @param fontSize 文字の大きさ
     * @returns 作成した文字
     */
    private createText(x: number, y: number, content: string, fontSize: number = this.FONT_SIZE): Phaser.GameObjects.Text {
        return this.add.text(x, y, content)
            .setOrigin(0.5)
            .setFontSize(fontSize)
            .setInteractive();
    }
}