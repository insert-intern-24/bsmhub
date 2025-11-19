# Portfolio Feature

포트폴리오 관련 기능 특화 컴포넌트들입니다.

## Components

- **ProfileItem.tsx** - 포트폴리오 상세에서 사용되는 항목 표시 컴포넌트 (링크, 수상 경력 등)

## 사용 위치

- 포트폴리오 상세 페이지 (PortfolioDetail)
- 팀 사이드바 (TeamSidebar)

## 주요 기능

- 링크 항목 표시 (아이콘 포함)
- 수상 경력 표시
- URL이 있는 경우 클릭 가능한 링크로 렌더링
- URL이 없는 경우 일반 텍스트로 표시

## Props

```typescript
interface ItemProps {
  mode?: 'link' | 'text';
  value?: string;
  url?: string;
  prize?: string;
}
```
