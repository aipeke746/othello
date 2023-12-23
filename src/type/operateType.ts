/**
 * 操作方法の種類
 * どこに自分のマークを置くかを決める方法
 */
export enum OperateType {
    /**
     * 手動
     */
    MANUAL,
    /**
     * MiniMax法
     */
    MINI_MAX,
    /**
     * αβ法
     */
    ALPHA_BETA,
}