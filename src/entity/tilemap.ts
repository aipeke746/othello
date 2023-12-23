import { MarkType } from "../type/markType";
import { Coord } from "../vo/coord";
import { MapState } from "./mapState";

/**
 * タイルマップを表すクラス
 */
export class Tilemap {
    /**
     * タイルマップの状態
     */
    public mapState: MapState;
    /**
     * タイルマップ
     */
    private map: Phaser.Tilemaps.Tilemap;
    /**
     * タイルセット
     */
    private tileset: Phaser.Tilemaps.Tileset;
    /**
     * レイヤー
     */
    private layer: Phaser.Tilemaps.TilemapLayer;

    /**
     * タイルマップを生成する
     * @param scene シーン
     * @param tilesetName タイルセットの名前
     */
    constructor(scene: Phaser.Scene, tilesetName: string) {
        this.mapState = new MapState();
        this.map = scene.make.tilemap({ data: this.mapState.getField(), tileWidth: MapState.SIZE, tileHeight: MapState.SIZE });
        this.tileset = this.getTileset(tilesetName, this.map);
        this.layer = this.getLayer(this.tileset);
    }

    /**
     * オセロのマークをひっくり返して、タイルマップの更新する
     * @param coord 座標
     * @param mark マーク
     */
    public advance(coord: Coord, mark: MarkType): void {
        this.mapState.advance(coord, mark);
        this.update();
    }

    /**
     * タイルマップの座標からワールド（画面）の座標を取得する
     * @params pos ワールドの座標
     * @returns ワールドの座標
     */
    public getTilePos(pos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
        return this.layer.worldToTileXY(pos.x, pos.y);
    }

    /**
     * ワールド（画面）の座標からタイルマップの座標を取得する
     * @params coord タイルマップの座標
     * @returns タイルマップの座標
     */
    public getWorldPos(coord: Coord): Phaser.Math.Vector2 {
        return this.layer.tileToWorldXY(coord.x, coord.y);
    }

    /**
     * MapStateの内容をTilemapに反映する
     */
    private update() {
        for (let y=0; y<MapState.LENGTH; y++) {
            for (let x=0; x<MapState.LENGTH; x++) {
                this.layer.putTileAt(this.mapState.getField()[y][x], x, y);
            }
        }
    }

    /**
     *　タイルセットを取得する
    * @param name タイルセットの名前
    * @param map タイルマップ
    * @returns　タイルセット
    */
    private getTileset(name: string, map: Phaser.Tilemaps.Tilemap) {
        const tileset = map.addTilesetImage(name);
        if (tileset == null)  {
            throw new Error('tileset is null');
        }
        return tileset;
    }

    /**
     * レイヤーを取得する
     * @param tileset タイルセット
     * @returns レイヤー
     */
    private getLayer(tileset: Phaser.Tilemaps.Tileset) {
        const layer = this.map?.createLayer(0, tileset, 0, 0);
        if (layer == null)  {
            throw new Error('layer is null');
        }
        return layer;
    }
}