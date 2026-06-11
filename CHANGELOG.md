# Changelog

## [0.1.0] - 2026-06-11

### Added
- 패키지 부트스트랩: ESM, Vite lib build, Vitest, `sideEffects: false`
- 데이터 전처리 유틸 서브패스 `@iyulab/flex-components/data` (ISSUE-20260609-flextable-missing-cutoff-helpers)
  - `dropMissing(rows, columns?)` — 지정한 열에 결측(빈 문자열·공백·비숫자) 셀이 있는 행 제외
  - `applyCutoff(values, { low?, high? })` — 범위 밖 값과 NaN 제외 (경계값 포함)
