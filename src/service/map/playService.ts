import { OperateManager } from "../../entity/operate/operateManager";
import { Tilemap } from "../../entity/map/tilemap";
import { MarkType } from "../../type/markType";
import { GameUtil } from "../../util/map/gameUtil";
import { PutMarkUtil } from "../../util/map/putMarkUtil";
import { ReverseToMarkUtil } from "../../util/mark/reverseToMarkUtil";
import { ReverseMarkUtil } from "../../util/map/reverseMarkUtil";
import { Coord } from "../../vo/coord";
import { AssistService } from "./assistService";

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

    constructor(scene: Phaser.Scene, operateManager: OperateManager, assist: AssistService) {
        this.scene = scene;
        this.operateManager = operateManager;
        this.assist = assist;
        this.createAnimation(scene);
    }

    /**
     * プレイする
     * @param tilemap タイルマップ
     */
    public do(tilemap: Tilemap) {
        PutMarkUtil.isPutable(tilemap.mapState)
            ? this.play(tilemap)
            : this.finish();
    }

    public isAnimating(): boolean {
        return this.isReversing;
    }

    /**
     * プレイする
     * @param tilemap タイルマップ
     */
    private play(tilemap: Tilemap) {
        if (this.isReversing) return;

        const nowMark = tilemap.mapState.getNowTurnMark();
        const operate = this.operateManager.getOperateService(nowMark);
        const coord = operate.getCoord(tilemap, nowMark);

        if (coord) {
            this.assist.removeAllCircle();
            this.playAnimation(tilemap, nowMark, coord);
            GameUtil.advance(tilemap, nowMark, coord);
        }
    }

    /**
     * 終了処理
     * @param tilemap タイルマップ
     */
    private finish() {
    }

    /**
     * ひっくり返すアニメーションを実行する
     * @param tilemap タイルマップ
     * @param mark 置いたマーク
     * @param putCoord 置かれた座標
     */
    private playAnimation(tilemap: Tilemap, mark: MarkType, putCoord: Coord) {
        this.isReversing = true;

        const reversibleCoords = ReverseMarkUtil.getReversibleCoords(tilemap.mapState, mark, putCoord);
        const key = ReverseToMarkUtil.get(mark);

        reversibleCoords.forEach(reversibleCoord => {
            const pos = tilemap.getWorldPos(reversibleCoord);
            const sprite = this.scene.add.sprite(pos.x, pos.y, key)
                .setOrigin(0, 0);

            sprite.anims.play(key).on('animationcomplete', () => {
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
    private createAnimation(scene: Phaser.Scene) {
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
}
