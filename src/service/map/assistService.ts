import { MapState } from "../../entity/mapState";
import { Tilemap } from "../../entity/tilemap";
import { Param } from '../../param';

/**
 * アシスト機能に関するサービス
 * 対象：手動操作のプレイヤー
 */
export class AssistService {
    /**
     * シーン
     */
    private scene: Phaser.Scene;
    /**
     * 置ける場所を示す円
     */
    private putableCircles: Phaser.GameObjects.Graphics[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * 置ける場所を表示する
     * @param tilemap タイルマップ
     * @param isManualOperator 手動操作のプレイヤーかどうか
     */
    public showPutableCoords(tilemap: Tilemap, isManualOperator: boolean): void {
        const mark = tilemap.mapState.getNowTurnMark();
        this.removeAllCircle();
        if (!this.isVisible(isManualOperator)) return;

        tilemap.mapState.getPutableCoords(mark).forEach(coord => {
            const pos = tilemap.getWorldPos(coord);
            const graphics = this.scene.add.graphics();
            const circle = graphics.lineStyle(2, 0x0000ff)
                .strokeCircle(pos.x + MapState.SIZE/2, pos.y + MapState.SIZE/2, 25);
            this.putableCircles.push(circle);
        });
        this.blinking(this.putableCircles);
    };

    /**
     * 表示するかどうかを判定する
     * @param isManualOperator 手動操作のプレイヤーかどうか
     * @returns 表示するかどうか
     */
    private isVisible(isManualOperator: boolean): boolean {
        return Param.SHOW_PUTABLE_CIRCLES && isManualOperator;
    }

    /**
     * 置ける場所を表示している円を全て削除する
     */
    private removeAllCircle() {
        this.putableCircles.forEach(circle => {
            circle.destroy();
        });
        this.putableCircles = [];
    }

    /**
     * 点滅させる
     * @param target 対象
     */
    private blinking(target: any) {
        this.scene.tweens.add({
            targets: target,
            alpha: 0,
            duration: 700,
            ease: 'Sine.easeIn',
            repeat: -1,
            yoyo: true
        });
    }
}