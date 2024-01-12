import { Param } from "../../static/param";
import { Coord } from "../../vo/coord";
import { MapState } from "./mapState";

/**
 * タイルマップを表すクラス
 * 
 * MapStateの内容をタイルマップに反映させることで、オセロのフィールドを描画する
 */
export class Tilemap {
    /**
     * マップの状態
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
     * ワールド（画面上）の座標からタイルマップ（オセロのマス目）の座標を取得する
     * @params pos ワールドの座標
     * @returns タイルマップの座標
     */
    public getTilePos(pos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
        return this.layer.worldToTileXY(pos.x, pos.y);
    }

    /**
     * タイルマップ（オセロのマス目）の座標からワールド（画面上）の座標を取得する
     * @params coord タイルマップの座標
     * @returns ワールドの座標
     */
    public getWorldPos(coord: Coord): Phaser.Math.Vector2 {
        return this.layer.tileToWorldXY(coord.x, coord.y);
    }

    /**
     * MapStateの内容をTilemapに反映する
     * （TilemapにMapStateのfieldを反映することで、反映されたオセロのフィールドが描画される）
     */
    public update() {
        for (let y=0; y<MapState.LENGTH; y++) {
            for (let x=0; x<MapState.LENGTH; x++) {
                const pos = new Phaser.Math.Vector2(x, y);
                this.layer.putTileAt(this.mapState.getMark(pos), x, y);
                this.layer.putTileAt(this.mapState.getMark(pos), x, y);
            }
        }
    }

    /**
     * 大きさを調整
     * @param ratio 比率
     */
    public setScale(ratio: number): void {
        this.layer.setScale(ratio);
    }

    /**
     * 指定した位置にオセロを描画する
     * @param x ｘ座標
     * @param y ｙ座標
     */
    public setPosition(x: number, y: number): void {
        this.layer.setPosition(x, y);
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
        const layer = this.map?.createLayer(0, tileset, Param.TILE_MARGIN, Param.TILE_MARGIN);
        if (layer == null)  {
            throw new Error('layer is null');
        }
        return layer;
    }
}