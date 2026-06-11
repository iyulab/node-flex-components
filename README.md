# @iyulab/flex-components

헤비/고급 컴포넌트와 데이터 유틸리티 패키지입니다. (예정: `flex-chart` — 명령형 인터랙티브 차트)

## Data Utilities

분석용 데이터 전처리 헬퍼 (순수 함수):

```ts
import { dropMissing, applyCutoff } from '@iyulab/flex-components/data';

// 지정한 열에 결측(빈 문자열·공백·비숫자) 셀이 있는 행 제외
const clean = dropMissing(rows, [0, 2]);

// 범위 밖 값과 NaN 제외 (경계값 포함)
const filtered = applyCutoff(values, { low: 0, high: 100 });
```
