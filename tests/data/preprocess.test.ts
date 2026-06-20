import { describe, it, expect } from 'vitest';
import { dropMissing, applyCutoff, applyCutoffRows } from '../../src/data/preprocess.js';

/**
 * 분석용 데이터 전처리 헬퍼 검증.
 *
 * 배경(ISSUE-20260609-flextable-missing-cutoff-helpers):
 * 시트 입력 데이터에서 (1) 비어있는/비숫자 셀이 있는 행 제외,
 * (2) 범위(cutoff low/high) 밖 값 제외가 여러 도구에서 중복 구현되고 있어
 * 범용 유틸로 정본화한다.
 */

describe('dropMissing', () => {
  const rows = [
    ['1.5', 'a', '10'],
    ['', 'b', '20'],      // 빈 셀 (col 0)
    ['2.5', 'c', 'abc'],  // 비숫자 셀 (col 2)
    ['3.5', 'd', '30'],
  ];

  it('지정한 열에 빈/비숫자 셀이 있는 행을 제외한다', () => {
    expect(dropMissing(rows, [0, 2])).toEqual([
      ['1.5', 'a', '10'],
      ['3.5', 'd', '30'],
    ]);
  });

  it('columns 미지정 시 모든 열을 검사한다', () => {
    // col 1은 전부 비숫자이므로 모든 행이 제외된다
    expect(dropMissing(rows)).toEqual([]);
  });

  it('특정 열만 검사하면 다른 열의 결측은 무시한다', () => {
    expect(dropMissing(rows, [0])).toEqual([
      ['1.5', 'a', '10'],
      ['2.5', 'c', 'abc'],
      ['3.5', 'd', '30'],
    ]);
  });

  it("'0'과 공백 포함 숫자는 유효한 값으로 취급한다", () => {
    const data = [
      ['0'],
      [' 12 '],
      ['1e3'],
      ['-4.2'],
    ];
    expect(dropMissing(data, [0])).toEqual(data);
  });

  it('공백만 있는 셀은 결측으로 취급한다', () => {
    expect(dropMissing([['  '], ['1']], [0])).toEqual([['1']]);
  });

  it('행 길이보다 큰 열 인덱스는 결측으로 취급한다', () => {
    expect(dropMissing([['1'], ['2', '3']], [1])).toEqual([['2', '3']]);
  });

  it('빈 입력은 빈 배열을 반환한다', () => {
    expect(dropMissing([], [0])).toEqual([]);
  });

  it('원본 배열을 변경하지 않는다', () => {
    const data = [['1'], ['x']];
    dropMissing(data, [0]);
    expect(data).toEqual([['1'], ['x']]);
  });
});

describe('applyCutoff', () => {
  const values = [1, 5, 10, 15, 20];

  it('low 미만 값을 제외한다', () => {
    expect(applyCutoff(values, { low: 5 })).toEqual([5, 10, 15, 20]);
  });

  it('high 초과 값을 제외한다', () => {
    expect(applyCutoff(values, { high: 15 })).toEqual([1, 5, 10, 15]);
  });

  it('low/high 모두 적용한다 (경계값 포함)', () => {
    expect(applyCutoff(values, { low: 5, high: 15 })).toEqual([5, 10, 15]);
  });

  it('범위 미지정 시 NaN만 제외하고 모두 유지한다', () => {
    expect(applyCutoff([1, NaN, 2], {})).toEqual([1, 2]);
  });

  it('NaN은 범위와 무관하게 항상 제외한다', () => {
    expect(applyCutoff([1, NaN, 10], { low: 0 })).toEqual([1, 10]);
  });

  it('빈 입력은 빈 배열을 반환한다', () => {
    expect(applyCutoff([], { low: 0, high: 1 })).toEqual([]);
  });

  it('원본 배열을 변경하지 않는다', () => {
    const data = [1, 2, 3];
    applyCutoff(data, { low: 2 });
    expect(data).toEqual([1, 2, 3]);
  });
});

describe('applyCutoffRows', () => {
  // (date, value) 쌍 — 차트 x축이 date를 쓰므로 행을 보존하며 필터링해야 한다.
  const rows = [
    ['2026-01-01', '1'],
    ['2026-01-02', '5'],
    ['2026-01-03', '10'],
    ['2026-01-04', '15'],
    ['2026-01-05', '20'],
  ];

  it('값 열 기준 범위 밖 행을 제외하고 다른 열(날짜)은 보존한다', () => {
    expect(applyCutoffRows(rows, 1, { low: 5, high: 15 })).toEqual([
      ['2026-01-02', '5'],
      ['2026-01-03', '10'],
      ['2026-01-04', '15'],
    ]);
  });

  it('low만/ high만 적용한다 (경계값 포함)', () => {
    expect(applyCutoffRows(rows, 1, { low: 10 })).toEqual([
      ['2026-01-03', '10'],
      ['2026-01-04', '15'],
      ['2026-01-05', '20'],
    ]);
    expect(applyCutoffRows(rows, 1, { high: 5 })).toEqual([
      ['2026-01-01', '1'],
      ['2026-01-02', '5'],
    ]);
  });

  it('값 열이 비숫자·결측인 행은 제외한다 (applyCutoff의 NaN 제외 미러)', () => {
    const data = [
      ['2026-01-01', '1'],
      ['2026-01-02', ''],     // 빈 셀
      ['2026-01-03', 'abc'],  // 비숫자
      ['2026-01-04', '  '],   // 공백
      ['2026-01-05', '4'],
    ];
    expect(applyCutoffRows(data, 1, {})).toEqual([
      ['2026-01-01', '1'],
      ['2026-01-05', '4'],
    ]);
  });

  it('범위 미지정 시 값 열이 숫자인 행을 모두 유지한다', () => {
    expect(applyCutoffRows(rows, 1, {})).toEqual(rows);
  });

  it('빈 입력은 빈 배열을 반환한다', () => {
    expect(applyCutoffRows([], 1, { low: 0, high: 1 })).toEqual([]);
  });

  it('원본 배열을 변경하지 않는다', () => {
    const data = [['a', '1'], ['b', '99']];
    applyCutoffRows(data, 1, { high: 10 });
    expect(data).toEqual([['a', '1'], ['b', '99']]);
  });
});
