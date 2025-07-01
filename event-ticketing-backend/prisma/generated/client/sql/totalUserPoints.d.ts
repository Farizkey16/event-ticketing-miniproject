import * as $runtime from "../runtime/library"

/**
 * @param int4
 */
export const totalUserPoints: (int4: number) => $runtime.TypedSql<totalUserPoints.Parameters, totalUserPoints.Result>

export namespace totalUserPoints {
  export type Parameters = [int4: number]
  export type Result = {
    total_points: bigint | null
  }
}
