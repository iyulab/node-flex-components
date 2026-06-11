/** cutoff 범위. 경계값은 포함됩니다. */
export interface CutoffRange {
  /** 하한 (포함). 미지정 시 하한 없음 */
  low?: number;
  /** 상한 (포함). 미지정 시 상한 없음 */
  high?: number;
}

/**
 * 지정한 열에 결측(빈 문자열·공백·비숫자) 셀이 있는 행을 제외합니다.
 *
 * @param rows 시트 데이터 (2D 문자열 배열)
 * @param columns 검사할 열 인덱스. 미지정 시 모든 열을 검사합니다.
 * @returns 결측이 없는 행만 남긴 새 배열
 */
export function dropMissing(
  rows: readonly (readonly string[])[],
  columns?: readonly number[],
): string[][] {
  return rows
    .filter(row => {
      const targets = columns ?? row.map((_, i) => i);
      return targets.every(col => !isMissing(row[col]));
    })
    .map(row => [...row]);
}

/** 셀이 결측(undefined·빈 문자열·공백·비숫자)인지 판정합니다. */
function isMissing(cell: string | undefined): boolean {
  if (cell === undefined || cell.trim() === '') return true;
  return Number.isNaN(Number(cell));
}

/**
 * 범위(low/high) 밖 값과 NaN을 제외합니다. 경계값은 포함됩니다.
 *
 * @param values 숫자 배열
 * @param range cutoff 범위
 * @returns 범위 안 값만 남긴 새 배열
 */
export function applyCutoff(values: readonly number[], range: CutoffRange): number[] {
  return values.filter(v =>
    !Number.isNaN(v) &&
    (range.low === undefined || v >= range.low) &&
    (range.high === undefined || v <= range.high),
  );
}
