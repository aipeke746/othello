import { Tilemap } from "../../../entity/tilemap";
import { MarkType } from "../../../type/markType";
import { Coord } from "../../../vo/coord";
import { OperateService } from "../operateService";

/**
 * 手動操作の実装
 */
export class ManualImpl implements OperateService {
    /**
     * ポインター
     */
    private pointer: Phaser.Input.Pointer;
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
        scene.input.on('pointerdown', () => this.isPointerDown = true, this);
        scene.input.on('pointerup', () => this.isPointerDown = false, this);
    }

    /**
     * オセロのマークを置く座標を取得する
     * @param tilemap タイルマップ
     * @param mark マーク
     * @returns 座標
     */
    getCoord(tilemap: Tilemap, mark: MarkType): Coord | undefined {
        return this.isPointerDown
            ? this.getManualCoord(tilemap, mark)
            : undefined;
    }

    /**
     * 手動操作でオセロのマークを置く座標を取得する
     * @param tilemap タイルマップ
     * @param mark マーク
     * @returns 座標
     */
    private getManualCoord(tilemap: Tilemap, mark: MarkType): Coord | undefined {
        const pos = this.pointer.position;
        const coord = new Coord(tilemap.getTilePos(pos));

        return tilemap.mapState.isReversible(coord, mark)
            ? coord
            : undefined;
    }
}