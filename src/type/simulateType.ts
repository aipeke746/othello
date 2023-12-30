export enum SimulateType {
    /**
     * 最大スコアでシミュレートする
     * スコア = 自分のマークの数 - 相手のマークの数
     */
    MAX_SCORE,
    /**
     * 重み付きマップでシミュレートする
     */
    WEIGHT_MAP,
}