# @iyulab/flex-components

분석용 데이터 전처리 유틸리티 패키지입니다 — 시트 형태(2차원 문자열 배열)의 데이터와 숫자 배열을 다루는 순수 함수.

```bash
npm install @iyulab/flex-components
```

## Data Utilities

```ts
import { dropMissing, applyCutoff, applyCutoffRows } from '@iyulab/flex-components/data';

// 지정한 열에 결측(빈 문자열·공백·비숫자) 셀이 있는 행 제외
const clean = dropMissing(rows, [0, 2]);

// 범위 밖 값과 NaN 제외 (경계값 포함)
const filtered = applyCutoff(values, { low: 0, high: 100 });

// 값 열(1)이 범위 밖이거나 결측인 행 제외 — 남은 행은 다른 열(예: 날짜)을 그대로 보존한다
const pairs = applyCutoffRows(rows, 1, { low: 0, high: 100 });
```

| 함수 | 입력 | 결과 |
|---|---|---|
| `dropMissing(rows, columns)` | 시트 행 · 검사할 열 인덱스 | 그 열들에 결측이 없는 행 |
| `applyCutoff(values, range)` | 숫자 배열 · `{ low?, high? }` | 범위 안(경계 포함)이고 NaN 이 아닌 값 |
| `applyCutoffRows(rows, valueColumn, range)` | 시트 행 · 값 열 · `{ low?, high? }` | 값 열이 범위 안인 행(행을 통째로 남기므로 `(date, value)` 쌍이 갈라지지 않는다) |

`range` 의 `low`·`high` 는 각각 생략할 수 있다(그쪽은 열림). 패키지 루트(`@iyulab/flex-components`)도 같은 셋을 낸다.
