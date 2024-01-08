/**
 * シーンに関係するユーティリティ
 */
export class SceneUtil {
    /**
     * 点滅させる
     * @param scene シーン
     * @param target 対象
     */
    public static blinking(scene: Phaser.Scene, target: any, duration: number = 700) {
        scene.tweens.add({
            targets: target,
            alpha: 0,
            duration: duration,
            ease: 'Sine.easeIn',
            repeat: -1,
            yoyo: true
        });
    }
}