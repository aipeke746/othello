import { Tilemap } from "../../entity/map/tilemap";
import { MarkType } from "../../type/markType";
import { Coord } from "../../vo/coord";

/**
 * 操作方法のインターフェース
 */
export interface OperateService {
    /**
     * オセロのマークを置く座標を取得する
     * （手動の場合、枠外などで座標がとれない場合はあるため、その時は undefined を返す）
     * @param tilemap タイルマップ
     * @param myMark 自分のマーク
     */
    getCoord(tilemap: Tilemap, myMark: MarkType): Coord | undefined;
}