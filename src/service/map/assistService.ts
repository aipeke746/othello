import { MapState } from '../../entity/map/mapState';
import type { Tilemap } from '../../entity/map/tilemap';
import { Param } from '../../static/param';
import { PutMarkUtil } from '../../util/map/putMarkUtil';
import { TweenUtil } from '../../util/scene/tweenUtil';

/**
 * アシスト機能に関するサービス
 *
 * 次にセットできる場所を表示する
 * 対象：手動操作のプレイヤー
 */
export class AssistService {
    /**
     * シーン
     */
    private readonly scene: Phaser.Scene;
    /**
     * セットできる場所を示す円
     */
    private putableCircles: Phaser.GameObjects.Graphics[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * セットできる場所を表示する
     * @param tilemap タイルマップ
     * @param isManualOperator 手動操作のプレイヤーかどうか
     */
    public showPutableCoords(tilemap: Tilemap, isManualOperator: boolean): void {
        const mark = tilemap.mapState.getNowTurnMark();
        this.removeAllCircle();
        if (!this.isVisible(isManualOperator)) return;

        PutMarkUtil.getPutableCoords(tilemap.mapState, mark).forEach((coord) => {
            const pos = tilemap.getWorldPos(coord);
            const graphics = this.scene.add.graphics();
            const circle = graphics
                .lineStyle(2, 0x0000ff)
                .strokeCircle(pos.x + MapState.SIZE / 2, pos.y + MapState.SIZE / 2, 25);
            this.putableCircles.push(circle);
        });
        TweenUtil.blinking(this.scene, this.putableCircles);
    }

    /**
     * セットできる場所を表示している円を全て削除する
     */
    public removeAllCircle(): void {
        this.putableCircles.forEach((circle) => {
            circle.destroy();
        });
        this.putableCircles = [];
    }

    /**
     * 表示するかどうかを判定する
     * @param isManualOperator 手動操作のプレイヤーかどうか
     * @returns 表示するかどうか
     */
    private isVisible(isManualOperator: boolean): boolean {
        return Param.SHOW_PUTABLE_CIRCLES && isManualOperator;
    }
}
