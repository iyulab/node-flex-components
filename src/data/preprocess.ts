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
  return values.filter(v => isWithin(v, range));
}

/**
 * 지정한 값 열을 기준으로 범위(low/high) 밖 행을 제외합니다. 경계값은 포함됩니다.
 *
 * `applyCutoff`의 행 보존 변형입니다. 값 열의 셀이 비숫자·결측이거나 범위 밖이면
 * 행 전체를 제외하되, 살아남은 행은 다른 열(예: 날짜 축)을 그대로 보존하므로
 * (date, value) 같은 쌍 구조가 분리되지 않습니다.
 *
 * @param rows 시트 데이터 (2D 문자열 배열)
 * @param valueColumn cutoff를 적용할 값 열 인덱스
 * @param range cutoff 범위
 * @returns 값 열이 범위 안인 행만 남긴 새 배열
 */
export function applyCutoffRows(
  rows: readonly (readonly string[])[],
  valueColumn: number,
  range: CutoffRange,
): string[][] {
  return rows
    .filter(row => {
      const cell = row[valueColumn];
      // 결측(빈·공백·비숫자) 셀은 Number()가 0/NaN으로 흡수하므로 먼저 제외한다.
      return !isMissing(cell) && isWithin(Number(cell), range);
    })
    .map(row => [...row]);
}

/** 값이 NaN이 아니고 범위(low/high, 경계 포함) 안에 있는지 판정합니다. */
function isWithin(v: number, range: CutoffRange): boolean {
  return (
    !Number.isNaN(v) &&
    (range.low === undefined || v >= range.low) &&
    (range.high === undefined || v <= range.high)
  );
}
