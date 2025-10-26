# Copilot 지침 (AI 코딩 에이전트용)

## 개요

이 BSMHub 프로젝트는 Next.js 기반 모노레포이며, 학교 학생들의 포트폴리오, 프로젝트를 전시하는 온라인 공간입니다. TypeScript, Tailwind CSS, PNPM 워크스페이스를 사용합니다. UI 컴포넌트, 페이지, 서비스, 유틸리티가 명확하게 분리되어 있습니다.

## 아키텍처 및 주요 패턴

- **앱 디렉터리 구조**: 주요 페이지와 레이아웃은 `src/app/`에 위치하며, 파일 기반 라우팅(`page.tsx`, `route.ts`)을 사용합니다.
- **컴포넌트**: UI 컴포넌트는 도메인별(`card/`, `modal/`, `layout/` 등)로 그룹화되어 있고, 여러 페이지에서 재사용됩니다.
- **서비스**: API/데이터 로직은 `src/app/services/`와 `src/app/mocks/services/`에 있습니다. 실제/모의 데이터 처리는 이곳에서 합니다.
- **유틸리티**: 날짜, 변환, Supabase 관련 함수는 `src/app/utils/`에 위치하며, 전역적으로 import하여 사용합니다.
- **스타일링**: Tailwind CSS는 `tailwind.config.ts`에서 설정하며, 전역 스타일은 `src/app/globals.css`에, 도메인별 스타일은 각 폴더에 있습니다.
- **상태 관리**: 교차 컴포넌트 상태는 React Context(`ModalContext.tsx` 등)로 관리합니다. 외부 상태 라이브러리보다 Context를 우선 사용합니다.
- **네비게이션**: Next.js의 `usePathname`, `useRouter` 훅을 사용하며, `Navigator.tsx`에서 현재 경로 하이라이트 예시를 볼 수 있습니다.

## 개발 워크플로우

- **개발 서버 실행**: `pnpm dev`(또는 `npm/yarn/bun dev`)로 로컬 실행
- **빌드**: `pnpm build`로 프로덕션 빌드
- **포맷팅**: Prettier(`prettier.config.js`) 사용, 커스텀 린트 규칙 없음
- **테스트**: 별도 테스트 설정 없음, 필요시 `src/`에 테스트 추가
- **배포**: 커스텀 CI/CD(`Jenkinsfile`)로 배포

## 코드 작성 원칙 및 스타일

- **DRY(Do not Repeat Yourself)**: 중복 코드를 최대한 피하고, 재사용 가능한 컴포넌트/함수로 분리합니다. 동일한 UI/로직이 반복될 경우 반드시 추상화하여 재사용하세요.
- **YAGNI(You Aren't Gonna Need It)**: 실제로 필요하지 않은 기능이나 복잡한 추상화는 도입하지 않습니다. 당장 요구되는 기능만 구현하고, 불필요한 확장/예상 코드는 작성하지 않습니다.
- **KISS(Keep It Simple, Stupid)**: 복잡한 구조나 과도한 추상화보다, 명확하고 간결한 코드를 우선합니다.
- **일관된 네이밍**: 컴포넌트, 함수, 변수명은 역할이 명확하게 드러나도록 작성하며, 영어로 통일합니다. 예시: `PortfolioCard`, `getProfileDetail`, `mockProjects` 등.
- **폴더/파일 구조**: 도메인별로 폴더를 나누고, 각 폴더 내에서 역할별로 파일을 분리합니다. 예시: `card/`, `modal/`, `services/`, `utils/` 등.
- **스타일 일관성**: Tailwind CSS를 기본으로 사용하며, 커스텀 스타일은 최소화합니다. 전역 스타일은 `globals.css`, 도메인별 스타일은 각 폴더에 위치시킵니다.
- **함수형 컴포넌트**: React 함수형 컴포넌트와 훅을 기본으로 사용합니다. 상태 관리는 Context를 우선 적용하며, 불필요한 외부 라이브러리 사용을 지양합니다.
- **명확한 책임 분리**: UI, 데이터, 유틸리티, 상태 관리 등 각 역할별로 코드를 분리하여, 한 파일/컴포넌트가 여러 책임을 가지지 않도록 합니다.
- **외부 링크**: 새 탭에서 열리도록 `target="_blank"`와, `rel="noopener noreferrer nofollow"` 속성을 추가합니다.
- **접근성 고려**: 시맨틱 HTML 요소 사용, ARIA 속성 추가 등 접근성 향상을 위한 코딩을 지향합니다.
- **예외 처리**: API 호출 및 비동기 작업 시 적절한 에러 처리를 구현하여, 사용자에게 명확한 피드백을 제공합니다.
  Always use context7 when I need code generation, setup or configuration steps, or
  library/API documentation. This means you should automatically use the Context7 MCP
  tools to resolve library id and get library docs without me having to explicitly ask.

## 커뮤니케이션 및 메시지 작성

- **주석, 코드 리뷰, 커밋 메시지, PR 메시지**는 모두 한국어로 작성합니다. 코드 내 설명, 변경 내역, 리뷰 의견 등 모든 커뮤니케이션은 한국어를 사용하세요.

## 관례 및 통합

- **TypeScript**: 모든 신규 코드는 TypeScript로 작성, 각 도메인별 `types.d.ts`에 타입 정의
- **모의 데이터**: 로컬 개발/테스트용 데이터는 `src/app/project/[project_name]/mock-data.json` 및 `src/app/data/mockProjects.ts` 활용
- **외부 서비스**: Supabase 연동은 `src/app/utils/supabase/`의 헬퍼를 사용
- **아이콘**: `@tabler/icons-react`로 통일
- **폰트**: Geist 폰트는 Next.js 폰트 최적화 기능으로 적용

## 예시

- **새 페이지 추가**: `src/app/`에 폴더 생성 후 `page.tsx` 추가
- **새 모달 추가**: `src/app/components/modal/Modal.tsx` 작성 후 `modal/index.ts`에 등록
- **새 서비스 추가**: API 로직은 `src/app/services/`, 모의 데이터는 `src/app/mocks/services/`에 작성

## 참고

- [README.md] 기본 설정 및 워크플로우
- [Jenkinsfile] CI/CD 파이프라인
- [tailwind.config.ts] 스타일 규칙
- [src/app/components/] UI 패턴
- [src/app/services/] 데이터/API 로직

---

관례나 워크플로우가 불명확하다면 유지보수자에게 문의하거나 예시를 요청하세요.
