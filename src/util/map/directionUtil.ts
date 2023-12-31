/**
 * 上下左右方向の座標の差分を返すユーティリティクラス
 */
export class DirectionUtil {
    /**
     * 上下左右方向の座標の差分
     */
    private static DIFF: Phaser.Math.Vector2[] = [
        new Phaser.Math.Vector2(-1, -1),
        new Phaser.Math.Vector2(-1, 0),
        new Phaser.Math.Vector2(-1, 1),
        new Phaser.Math.Vector2(0, -1),
        new Phaser.Math.Vector2(0, 1),
        new Phaser.Math.Vector2(1, -1),
        new Phaser.Math.Vector2(1, 0),
        new Phaser.Math.Vector2(1, 1),
    ]

    /**
     * 上下左右方向の座標の差分を返す
     * @returns 上下左右方向の座標の差分
     */
    public static getDiff(): Phaser.Math.Vector2[] {
        return DirectionUtil.DIFF;
    }
}