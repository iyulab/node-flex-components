# Changelog

## [0.2.0] - 2026-06-20

### Added
- `applyCutoffRows(rows, valueColumn, range)` — 행 기반 cutoff 변형. 값 열만 검사해 범위 밖·결측 행을 제외하되 살아남은 행의 다른 열(날짜 축 등)을 보존한다. 플랫 배열을 다루는 `applyCutoff` 는 (date, value) 쌍을 분리시켜 소비자가 축 정렬을 잃는 문제가 있었다. 결측 정의(빈·공백·비숫자)는 `dropMissing` 과 동일하다. (ISSUE-20260609 소비자 후속 — spc-workbench preprocess 이관)

## [0.1.0] - 2026-06-11

### Added
- 패키지 부트스트랩: ESM, Vite lib build, Vitest, `sideEffects: false`
- 데이터 전처리 유틸 서브패스 `@iyulab/flex-components/data` (ISSUE-20260609-flextable-missing-cutoff-helpers)
  - `dropMissing(rows, columns?)` — 지정한 열에 결측(빈 문자열·공백·비숫자) 셀이 있는 행 제외
  - `applyCutoff(values, { low?, high? })` — 범위 밖 값과 NaN 제외 (경계값 포함)
