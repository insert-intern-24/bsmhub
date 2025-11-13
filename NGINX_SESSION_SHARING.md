# Nginx 경로 기반 배포 환경에서 Supabase 세션 공유 가이드

## 문제 상황

- `/` 경로: bsmhub (Next.js, `@supabase/ssr` 사용)
- `/admin` 경로: bsmhub-admin-web-v2 (React/Vite, `@supabase/supabase-js` 사용)

두 서비스가 같은 도메인의 다른 경로에 배포되어 있지만, 서로 다른 저장 방식을 사용하여 세션이 공유되지 않는 문제가 발생합니다.

### 원인

1. **bsmhub (현재 앱)**
   - `@supabase/ssr` 사용
   - 서버: 쿠키 기반 인증
   - 클라이언트: 쿠키 + localStorage

2. **admin-web**
   - `@supabase/supabase-js` 사용
   - localStorage만 사용

→ 각 서비스가 다른 저장소를 우선 사용하여 세션이 공유되지 않음

## 해결 방법

### 구현 완료 ✅

**방식**: Next.js 앱에서 localStorage → 쿠키 동기화

admin-web을 수정하지 않고, Next.js 앱에서 localStorage의 세션을 읽어 쿠키로 동기화하는 방식으로 해결했습니다.

#### 1. Supabase 쿠키 설정

쿠키가 `/` 경로에서 설정되어 `/admin`에서도 접근 가능하도록 명시적으로 설정:

- `src/utils/supabase/client.ts`: 쿠키 핸들러 추가
- `src/utils/supabase/server.ts`: path=/ 명시
- `src/utils/supabase/middleware.ts`: path=/ 명시

#### 2. localStorage → 쿠키 동기화 컴포넌트

`src/app/components/auth/SupabaseSessionSync.tsx`를 생성하여 자동으로 세션 동기화:

- admin-web에서 로그인 → localStorage에 세션 저장
- Next.js 앱 로드 시 localStorage 확인
- 세션이 있으면 Supabase 클라이언트를 통해 쿠키로 동기화

이 방식으로 **admin-web 수정 없이** 양방향 세션 공유가 가능합니다.

### ~~2. admin-web 수정 (대안 방법)~~ - 불필요

~~admin-web도 쿠키를 사용하도록 수정해야 합니다. 두 가지 방법이 있습니다:~~

**참고**: 위의 localStorage 동기화 방식으로 충분하므로 admin-web 수정은 불필요합니다.

#### 방법 A: `@supabase/ssr`로 마이그레이션 (권장)

`@supabase/supabase-js`를 `@supabase/ssr`로 교체합니다.

```bash
npm uninstall @supabase/supabase-js
npm install @supabase/ssr
```

Supabase 클라이언트 파일 수정:

```typescript
// src/lib/supabase.ts (또는 유사한 파일)
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name: string) {
        return document.cookie
          .split('; ')
          .find(row => row.startsWith(`${name}=`))
          ?.split('=')[1];
      },
      set(name: string, value: string, options: any) {
        document.cookie = `${name}=${value}; path=/; ${options.maxAge ? `max-age=${options.maxAge}` : ''}; SameSite=Lax`;
      },
      remove(name: string, options: any) {
        document.cookie = `${name}=; path=/; max-age=0`;
      },
    },
  }
);
```

#### 방법 B: 커스텀 Storage 구현

`@supabase/supabase-js`를 유지하면서 커스텀 storage를 구현합니다.

```typescript
import { createClient } from '@supabase/supabase-js';

// Cookie Storage 구현
const cookieStorage = {
  getItem: (key: string) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(`${key}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  },
  setItem: (key: string, value: string) => {
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=604800; SameSite=Lax`;
  },
  removeItem: (key: string) => {
    document.cookie = `${key}=; path=/; max-age=0`;
  },
};

// Supabase 클라이언트 생성
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: cookieStorage,
      storageKey: 'sb-bsmhubsp-auth-token',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
```

### 3. Nginx 설정 확인

Nginx 설정에서 쿠키가 올바르게 전달되는지 확인:

```nginx
location / {
    proxy_pass http://bsmhub;
    proxy_set_header Cookie $http_cookie;
    proxy_cookie_path / /;
}

location /admin {
    proxy_pass http://admin-web;
    proxy_set_header Cookie $http_cookie;
    proxy_cookie_path / /;
}
```

## 테스트 방법

### 시나리오 1: admin-web에서 로그인 후 bsmhub 접속

1. `/admin`에서 로그인
2. localStorage에 `sb-bsmhubsp-auth-token` 저장 확인
3. `/` (bsmhub)로 이동
4. `SupabaseSessionSync` 컴포넌트가 자동으로 세션 동기화
5. 로그인 상태 유지 확인

### 시나리오 2: bsmhub에서 로그인 후 admin-web 접속

1. `/`에서 로그인
2. 쿠키와 localStorage에 세션 저장
3. `/admin`으로 이동
4. admin-web이 localStorage에서 세션 읽기
5. 로그인 상태 유지 확인

### 개발자 도구 확인사항

- **Application → Local Storage**: `sb-bsmhubsp-auth-token` 존재
- **Application → Cookies**:
  - `sb-bsmhubsp-auth-token.0`
  - `sb-bsmhubsp-auth-token.1`
  - Path가 `/`인지 확인

## 주의사항

- 쿠키 이름 (`sb-bsmhubsp-auth-token`)은 Supabase 프로젝트 URL에서 자동으로 생성됩니다
- 두 앱이 같은 Supabase 프로젝트를 사용해야 합니다
- 쿠키의 SameSite 속성은 `Lax` 또는 `None`이어야 합니다
- HTTPS 환경에서는 `Secure` 플래그가 자동으로 추가됩니다

## 참고 자료

- [@supabase/ssr 문서](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase Auth 공식 문서](https://supabase.com/docs/guides/auth)
