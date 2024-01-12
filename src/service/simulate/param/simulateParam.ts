/**
 * αβ法の探索パラメータ
 */
export class SimulateParam {
    /**
     * 探索する深さ
     */
    public depth: number;
    /**
     * α値
     */
    public alpha: number;
    /**
     * β値
     */
    public beta: number;

    constructor(depth: number, alpha: number, beta: number) {
        this.depth = depth;
        this.alpha = alpha;
        this.beta = beta;
    }

    /**
     * パラメータを複製する
     * @returns 複製したパラメータ
     */
    clone(): SimulateParam {
        return new SimulateParam(this.depth, this.alpha, this.beta);
    }
}
