import { Tilemap } from "../entity/tilemap";
import { OperateFactory } from "../factory/operateFactory";
import { OperateService } from "../service/operate/operateService";
import { MarkType } from "../type/markType";
import { OperateType } from "../type/operateType";
import { MapService } from '../service/map/mapService';

/**
 * ゲームのプレイシーン
 */
export class PlayScene extends Phaser.Scene {
    private tilemap?: Tilemap;
    private turnMap: Map<MarkType, OperateService> = new Map<MarkType, OperateService>();
    private mapService: MapService = new MapService(this);

    constructor() {
        super({ key: 'PlayScene'});
    }

    init() {
        this.turnMap = new Map<MarkType, OperateService>();
        this.turnMap.set(MarkType.BLACK, OperateFactory.create(this, OperateType.ALPHA_BETA));
        this.turnMap.set(MarkType.WHITE, OperateFactory.create(this, OperateType.MANUAL));
    }

    preload() {
        this.load.image('mapTiles', 'assets/images/mapTiles.png');
    }

    create() {
        this.tilemap = new Tilemap(this, 'mapTiles');
        this.mapService.showPutableCoords(this.tilemap);
    }

    update() {
        if (!this.tilemap) return;

        if (this.tilemap.mapState.isDone()) {
            console.log("黒: ", this.tilemap.mapState.getMarkCount(MarkType.BLACK), " / 白: ", this.tilemap.mapState.getMarkCount(MarkType.WHITE));
        } else {
            this.play(this.tilemap, this.turnMap);
        }
    }

    /**
     * プレイを実行する
     * @param tilemap タイルマップ
     * @param turnMap ターンマップ
     */
    private play(tilemap: Tilemap, turnMap: Map<MarkType, OperateService>) {
        const markTurn: MarkType = tilemap.mapState.getNowTurnMark();
        const coord = turnMap.get(markTurn)?.getCoord(tilemap, markTurn);

        if (coord) {
            tilemap.advance(coord, markTurn);
            this.mapService.showPutableCoords(tilemap);
        }
    }
}