import { ReverseToMarkUtil } from "../util/mark/reverseToMarkUtil";

/**
 * アニメーションを作成する
 */
export class Animation {
    /**
     * マークをひっくり返すアニメーションを作成する
     * @param scene シーン
     */
    public static createMarkReverseAnim(scene: Phaser.Scene): void {
        const keys: string[] = ReverseToMarkUtil.getAll();

        for (const key of keys) {
            if (this.isExist(scene, key)) continue;

            scene.anims.create({
                key: key,
                frames: scene.anims.generateFrameNumbers(key, {start: 0, end: 4}),
                frameRate: 10,
                delay: 300,
                repeat: 0,
            });
        }
    }

    /**
     * 既にアニメーションを作成されているかどうか
     * @param scene シーン
     * @param key キー
     * @returns 既にアニメーションを作成されている場合はtrue
     */
    private static isExist(scene: Phaser.Scene, key: string): boolean {
        return scene.anims.exists(key);
    }
}