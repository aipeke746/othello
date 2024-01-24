import { Tilemap } from '../../../entity/map/tilemap';
import type { MarkType } from '../../../type/markType';
import { ReverseMarkUtil } from '../../../util/map/reverseMarkUtil';
import { Coord } from '../../../vo/coord';
import type { OperateService } from '../operateService';

/**
 * 手動操作するクラス
 */
export class ManualImpl implements OperateService {
    /**
     * ポインター
     */
    private readonly pointer: Phaser.Input.Pointer;
    /**
     * ポインターが押されているかどうか
     */
    private isPointerDown: boolean = false;

    /**
     * ポインターが押されているかどうかの状態を検知するためのイベントを登録
     * @param scene シーン
     */
    constructor(scene: Phaser.Scene) {
        this.pointer = scene.input.activePointer;
        scene.input.on('pointerdown', () => (this.isPointerDown = true), this);
        scene.input.on('pointerup', () => (this.isPointerDown = false), this);
    }

    /**
     * オセロのマークをセットする座標を取得する
     * @param tilemap タイルマップ
     * @param mark マーク
     * @returns 座標
     */
    getCoord(tilemap: Tilemap, mark: MarkType): Coord | undefined {
        return this.isPointerDown ? this.getManualCoord(tilemap, mark) : undefined;
    }

    /**
     * 手動操作でオセロのマークをセットする座標を取得する
     * @param tilemap タイルマップ
     * @param mark マーク
     * @returns 座標
     */
    private getManualCoord(tilemap: Tilemap, mark: MarkType): Coord | undefined {
        const pos = this.pointer.position;
        try {
            const coord = new Coord(tilemap.getTilePos(pos));
            return ReverseMarkUtil.isReversible(tilemap.mapState, coord, mark) ? coord : undefined;
        } catch (e) {
            return undefined;
        }
    }
}
