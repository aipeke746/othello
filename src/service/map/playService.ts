import { OperateManager } from "../../entity/operate/operateManager";
import { Tilemap } from "../../entity/map/tilemap";
import { MarkType } from "../../type/markType";
import { GameUtil } from "../../util/map/gameUtil";
import { PutMarkUtil } from "../../util/map/putMarkUtil";
import { ReverseToMarkUtil } from "../../util/mark/reverseToMarkUtil";
import { ReverseMarkUtil } from "../../util/map/reverseMarkUtil";
import { Coord } from "../../vo/coord";
import { AssistService } from "./assistService";
import { TakeBackService } from "./takeBackService";

/**
 * ゲームのプレイサービス
 */
export class PlayService {
    private scene: Phaser.Scene;
    /**
     * 操作方法のマネージャー
     */
    private operateManager: OperateManager;
    /**
     * アシストサービス
     */
    private assist: AssistService;
    /**
     * ひっくり返すアニメーションを実行中かどうか
     */
    private isReversing: boolean = false;
    /**
     * ゲームが終了したかどうか
     */
    private isFinished: boolean = false;
    /**
     * マークをセットした時の音
     */
    private putMarkSound: Phaser.Sound.BaseSound;
    /**
     * マークをひっくり返した時の音
     */
    private reverseMarkSound: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene, operateManager: OperateManager, assist: AssistService) {
        this.scene = scene;
        this.operateManager = operateManager;
        this.assist = assist;
        this.putMarkSound = scene.sound.add('putMarkSound');
        this.reverseMarkSound = scene.sound.add('reverseMarkSound');
        this.createAnimation(scene);
    }

    /**
     * プレイする
     * @param tilemap タイルマップ
     */
    public do(tilemap: Tilemap, takeBackService: TakeBackService): void {
        if (this.isReversing || this.isFinished) return;

        PutMarkUtil.isPutable(tilemap.mapState)
            ? this.play(tilemap, takeBackService)
            : this.finish(tilemap);
    }

    /**
     * プレイする
     * @param tilemap タイルマップ
     */
    private play(tilemap: Tilemap, takeBackService: TakeBackService): void {
        const nowMark = tilemap.mapState.getNowTurnMark();
        const operate = this.operateManager.getOperateService(nowMark);
        const coord = operate.getCoord(tilemap, nowMark);

        if (coord) {
            this.putMarkSound.play();
            takeBackService.update(nowMark, tilemap.mapState);
            this.assist.removeAllCircle();
            this.playAnimation(tilemap, nowMark, coord);
            GameUtil.advance(tilemap, nowMark, coord);
        }
    }

    /**
     * 終了処理
     * ポップアップで勝敗表示を行う
     * @param tilemap タイルマップ
     */
    private finish(tilemap: Tilemap): void {
        this.isFinished = true;
        this.scene.scene.launch('finishScene', { winner: this.getWinnerContent(tilemap) });
    }

    /**
     * ひっくり返すアニメーションを実行する
     * @param tilemap タイルマップ
     * @param mark 置いたマーク
     * @param putCoord 置かれた座標
     */
    private playAnimation(tilemap: Tilemap, mark: MarkType, putCoord: Coord): void {
        this.isReversing = true;

        const reversibleCoords = ReverseMarkUtil.getReversibleCoords(tilemap.mapState, mark, putCoord);
        const key = ReverseToMarkUtil.get(mark);

        reversibleCoords.forEach(reversibleCoord => {
            const pos = tilemap.getWorldPos(reversibleCoord);
            const sprite = this.scene.add.sprite(pos.x, pos.y, key)
                .setOrigin(0, 0);

            sprite.anims.play(key).on('animationcomplete', () => {
                this.reverseMarkSound.play();
                sprite.destroy();
                const nextMark = tilemap.mapState.getNowTurnMark();
                this.assist.showPutableCoords(tilemap, this.operateManager.isManual(nextMark));
                this.isReversing = false;
            })
        });
    }

    /**
     * ひっくり返すアニメーションを作成する
     * @param scene シーン
     */
    private createAnimation(scene: Phaser.Scene): void {
        const keys: string[] = ReverseToMarkUtil.getAll();

        for (const key of keys) {
            scene.anims.create({
                key: key,
                frames: scene.anims.generateFrameNumbers(key, {start: 0, end: 4}),
                frameRate: 10,
                delay: 300,
                repeat: 0,
            });
        }
    }

    /**
     * 勝敗判定を行い、結果を文字列で返す
     * @param tilemap タイルマップ
     * @returns 勝敗結果の文字列
     */
    private getWinnerContent(tilemap: Tilemap): string {
        const blackCount: number = tilemap.mapState.getMarkCount(MarkType.BLACK);
        const whiteCount: number = tilemap.mapState.getMarkCount(MarkType.WHITE);

        if (blackCount > whiteCount) {
            return '黒の勝ち';
        } else if (blackCount < whiteCount) {
            return '白の勝ち';
        } else {
            return '引き分け';
        }
    }
}
