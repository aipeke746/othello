/**
 * Tweenに関係するユーティリティ
 */
export class TweenUtil {
    /**
     * 点滅させる
     * @param scene シーン
     * @param target 点滅させる対象
     * @param duration 1回の点滅にかかる時間
     */
    public static blinking(
        scene: Phaser.Scene,
        target: any,
        duration: number = 700
    ) {
        scene.tweens.add({
            targets: target,
            alpha: 0,
            duration: duration,
            ease: 'Sine.easeIn',
            repeat: -1,
            yoyo: true,
        });
    }
}
