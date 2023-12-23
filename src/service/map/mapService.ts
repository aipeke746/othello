import { MapState } from "../../entity/mapState";
import { Tilemap } from "../../entity/tilemap";
import { Param } from "../../param";

export class MapService {
    private scene: Phaser.Scene;
    private isVisible: boolean = Param.SHOW_PUTABLE_CIRCLES;
    private putableCircles: Phaser.GameObjects.Graphics[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public showPutableCoords(tilemap: Tilemap): void {
        const mark = tilemap.mapState.getNowTurnMark();
        if (!this.isVisible) return;
        this.removeAllCircle();

        tilemap.mapState.getPutableCoords(mark).forEach(coord => {
            const pos = tilemap.getWorldPos(coord);
            const graphics = this.scene.add.graphics();
            const circle = graphics.lineStyle(2, 0x0000ff)
                .strokeCircle(pos.x + MapState.SIZE/2, pos.y + MapState.SIZE/2, 25);
            this.putableCircles.push(circle);
        });
        this.blinking(this.putableCircles);
    };

    private removeAllCircle() {
        this.putableCircles.forEach(circle => {
            circle.destroy();
        });
        this.putableCircles = [];
    }

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