# (box-layout) 사이드바 레이아웃 컨벤션

## 개요

`(box-layout)` Route Group 내의 상세 페이지들은 일관된 사이드바 + 메인 콘텐츠 구조를 사용합니다. 이 컨벤션은 Portfolio, Team, Project 페이지의 레이아웃 일관성을 보장합니다.

## 공통 레이아웃 구조

### 기본 구조

모든 상세 페이지는 다음 구조를 따릅니다:

```
┌─────────────────────────────────────────┐
│  AvatarIcon (absolute, 상단 중앙)      │
├──────────────┬──────────────────────────┤
│              │  Title/Header           │
│  Sidebar     │  ────────────────────   │
│  (고정 너비) │                          │
│              │  Main Content            │
│              │  (가변 너비)             │
│              │                          │
└──────────────┴──────────────────────────┘
```

### 레이아웃 컴포넌트 구조

```typescript
<div className="w-full relative">
  {/* 1. AvatarIcon - 상단 중앙에 absolute 위치 */}
  <AvatarIcon image={imageUrl} />
  
  {/* 2. Title/Header 영역 (선택적) */}
  <TitleEN>...</TitleEN>
  
  {/* 3. 사이드바 + 메인 콘텐츠 컨테이너 */}
  <div className="flex-row"> {/* 또는 grid */}
    {/* 사이드바 */}
    <aside className="w-[21.75rem] ...">
      {/* 사이드바 내용 */}
    </aside>
    
    {/* 메인 콘텐츠 */}
    <section className="w-full"> {/* 또는 flex-1 */}
      {/* 메인 콘텐츠 */}
    </section>
  </div>
</div>
```

## 사이드바 규칙

### 1. 사이드바 너비

**데스크톱:**
- 고정 너비: `w-[21.75rem]` (348px)
- 최소 너비: `min-w-[21.75rem]`

**모바일:**
- 전체 너비: `mobile:w-full`
- 최소 너비 제거: `mobile:min-w-0`

```typescript
<div className="w-[21.75rem] min-w-[21.75rem] mobile:w-full mobile:min-w-0">
  {/* 사이드바 내용 */}
</div>
```

### 2. 사이드바 Positioning

**데스크톱:**
- Sticky positioning: `sticky top-24 self-start`
- 스크롤 시 상단에 고정

**모바일:**
- Static positioning: `mobile:static`
- 스크롤 시 함께 이동

```typescript
<aside className="sticky top-24 self-start mobile:static">
  {/* 사이드바 내용 */}
</aside>
```

### 3. 사이드바 내부 구조

사이드바는 두 부분으로 나뉩니다:

#### 상단 영역 (스크롤됨)
- Title, Description 등
- `pt-[4.5rem]` 패딩 (AvatarIcon 공간 확보)

#### 하단 영역 (Sticky)
- Edit 버튼, 상세 정보 등
- `sticky top-24`로 고정

```typescript
<div className="w-[21.75rem] min-w-[21.75rem]">
  {/* 상단 영역 - 스크롤됨 */}
  <div className="pt-[4.5rem]">
    <TitleEN>제목</TitleEN>
    <Body>설명</Body>
  </div>
  
  {/* 하단 영역 - Sticky */}
  <aside className="sticky top-24 self-start mobile:static mt-[1.6rem]">
    <EditButton />
    <DetailSections />
  </aside>
</div>
```

## 메인 콘텐츠 규칙

### 1. 메인 콘텐츠 너비

**데스크톱:**
- 전체 너비: `w-full` 또는 `flex-1`
- 패딩: 좌측 `pl-[3rem]` (사이드바와의 간격)

**모바일:**
- 전체 너비: `mobile:w-full`
- 패딩: `mobile:px-0` 또는 `mobile:p-3`

```typescript
<section className="w-full pl-[3rem] pt-[4.5rem] mobile:px-0 mobile:pt-0">
  {/* 메인 콘텐츠 */}
</section>
```

### 2. 메인 콘텐츠 상단 여백

AvatarIcon과 Title 공간을 확보하기 위해 상단 여백을 사용합니다:

```typescript
<section className="pt-[4.5rem] mobile:pt-0">
  {/* 메인 콘텐츠 */}
</section>
```

## AvatarIcon 규칙

### 1. 위치

- Absolute positioning: `absolute -top-20`
- 상단 중앙에 배치
- 부모 컨테이너는 `relative`여야 함

```typescript
<div className="w-full relative">
  <AvatarIcon image={imageUrl} />
  {/* 나머지 내용 */}
</div>
```

### 2. 크기

- 기본 크기: `(120 / 16) * 14` = `105px` (width, height)
- Shape: `rounded`

## 레이아웃 컨테이너 규칙

### 1. Flex 레이아웃

사이드바와 메인 콘텐츠를 나란히 배치:

```typescript
<div className="w-full flex-row relative">
  <AvatarIcon image={imageUrl} />
  <Sidebar />
  <section className="w-full">
    {/* 메인 콘텐츠 */}
  </section>
</div>
```

### 2. Grid 레이아웃 (Portfolio Home 예시)

복잡한 레이아웃의 경우 Grid 사용:

```typescript
<div className="grid grid-cols-[22rem_1fr] grid-rows-[auto_auto] gap-x-8 gap-y-4">
  {/* 사이드바와 메인 콘텐츠 */}
</div>
```

## 반응형 처리

### 1. 모바일 레이아웃 변경

모바일에서는 사이드바가 메인 콘텐츠 위로 이동합니다:

```typescript
<div className="flex-row mobile:flex-col mobile:gap-y-8">
  <Sidebar />
  <MainContent />
</div>
```

### 2. 모바일 사이드바 처리

- Sticky 해제: `mobile:static`
- 전체 너비: `mobile:w-full`
- 패딩 조정: `mobile:px-0 mobile:pb-8`

## 실제 구현 예시

### Portfolio Home 구조

```typescript
// PortfolioHome.tsx
<>
  <aside className="flex-col gap-6 sticky top-24 self-start w-[21.75rem] mobile:static mobile:w-full">
    <ProfileEditButton />
    <PortfolioDetailSection />
  </aside>
  <section className="flex-col gap-5 min-h-[calc(100vh-10rem)] mobile:min-h-0">
    {/* 메인 콘텐츠 */}
  </section>
</>
```

### Team 구조

```typescript
// Team.tsx
<div className="w-full flex-row relative">
  <AvatarIcon image={teamDetail.profile_image} />
  <TeamSidebar teamDetail={teamDetail} projectCount={teamProjects.length} />
  <section className="w-full">
    <ProjectGrid projects={teamProjects} />
  </section>
</div>
```

### Project 구조

```typescript
// ProjectPage.tsx
<section className="w-full">
  <div className="flex mobile:flex-col mobile:gap-y-8">
    <ProjectSidebar project={viewModel} />
    <ProjectMainContent project={viewModel} />
  </div>
</section>
```

## 일관성 체크리스트

새로운 상세 페이지를 만들 때 다음을 확인하세요:

- [ ] AvatarIcon이 상단에 absolute로 배치되어 있는가?
- [ ] 사이드바 너비가 `21.75rem`인가?
- [ ] 사이드바가 데스크톱에서 `sticky top-24`인가?
- [ ] 모바일에서 사이드바가 `static`으로 변경되는가?
- [ ] 메인 콘텐츠가 `w-full` 또는 `flex-1`인가?
- [ ] 상단 여백이 `pt-[4.5rem]`인가?
- [ ] 반응형 클래스가 올바르게 적용되어 있는가?

## 주의사항

1. **사이드바 너비 일관성**: 모든 사이드바는 `21.75rem` (348px)을 사용합니다.
2. **Sticky 위치**: 사이드바의 sticky 위치는 `top-24` (96px)입니다.
3. **모바일 전환**: 모바일에서는 사이드바가 static으로 변경되어 스크롤과 함께 이동합니다.
4. **AvatarIcon 공간**: 상단에 `pt-[4.5rem]` 여백을 두어 AvatarIcon 공간을 확보합니다.
