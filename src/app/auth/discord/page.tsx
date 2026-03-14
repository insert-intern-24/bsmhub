import { JWTPayload, importSPKI, jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import { createClient } from '@/services/supabase/server';

type DiscordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
    callback?: string | string[];
  }>;
};

type DiscordTokenPayload = JWTPayload & {
  discord_id?: string | number;
  callback_url?: string;
};

const getSingleParam = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const getSafeRelativePath = (value: string | null): string => {
  if (!value) {
    return '/';
  }

  if (value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }

  return '/';
};

const verifyDiscordBotJwt = async (
  token: string,
): Promise<DiscordTokenPayload> => {
  const publicKey = process.env.DISCORD_BOT_JWT_PUBLIC_KEY;
  const secret = process.env.DISCORD_BOT_JWT_SECRET;

  if (!publicKey && !secret) {
    throw new Error(
      'DISCORD_BOT_JWT_PUBLIC_KEY 또는 DISCORD_BOT_JWT_SECRET이 필요합니다.',
    );
  }

  let verificationKey: CryptoKey | Uint8Array;
  const algorithms = publicKey ? ['RS256'] : ['HS256'];

  if (publicKey) {
    // Accept multiple public key representations:
    // - PEM string (-----BEGIN PUBLIC KEY-----...)
    // - base64 of the PEM
    // - escaped newlines ("-----BEGIN...\n...") stored in env
    let pub = publicKey;

    // If stored as base64 (no BEGIN header), try to decode
    if (!pub.includes('-----BEGIN')) {
      try {
        if (typeof Buffer !== 'undefined') {
          pub = Buffer.from(pub, 'base64').toString('utf8');
        } else if (typeof atob === 'function') {
          pub = decodeURIComponent(escape(atob(pub)));
        }
      } catch (e) {
        // ignore decode errors and fallthrough to importSPKI which will error
      }
    }

    // Normalize escaped newlines -> real newlines
    pub = pub.replace(/\\n/g, '\n');

    verificationKey = await importSPKI(pub, 'RS256');
  } else {
    verificationKey = new TextEncoder().encode(secret);
  }

  const { payload } = await jwtVerify(token, verificationKey, {
    algorithms,
  });

  return payload as DiscordTokenPayload;
};

const getDiscordIdFromPayload = (payload: DiscordTokenPayload): string => {
  const rawDiscordId = payload.discord_id ?? payload.sub;

  if (typeof rawDiscordId === 'number') {
    if (!Number.isInteger(rawDiscordId) || rawDiscordId <= 0) {
      throw new Error('discord_id 값이 올바르지 않습니다.');
    }
    return String(rawDiscordId);
  }

  if (typeof rawDiscordId === 'string' && /^\d+$/.test(rawDiscordId)) {
    return rawDiscordId;
  }

  throw new Error('JWT payload에 discord_id 또는 sub가 필요합니다.');
};

export default async function DiscordAuthPage({
  searchParams,
}: DiscordPageProps) {
  const params = await searchParams;
  const token = getSingleParam(params.token);
  const callback = getSingleParam(params.callback);

  if (!token) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Discord 연동 실패</h1>
        <p className="mt-2 text-sm text-gray-600">JWT 토큰이 없습니다.</p>
      </div>
    );
  }

  let payload: DiscordTokenPayload;
  let discordId: string;

  try {
    payload = await verifyDiscordBotJwt(token);
    discordId = getDiscordIdFromPayload(payload);
  } catch (error) {
    console.error('Discord JWT 검증 실패:', error);

    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Discord 연동 실패</h1>
        <p className="mt-2 text-sm text-gray-600">유효하지 않은 JWT입니다.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const nextPath = `/auth/discord?token=${encodeURIComponent(token)}${callback ? `&callback=${encodeURIComponent(callback)}` : ''}`;
    redirect(`/auth/login?next=${encodeURIComponent(nextPath)}`);
  }

  const { data: student, error: studentError } = await supabase
    .from('student')
    .select('student_id')
    .eq('student_id', user.id)
    .maybeSingle<{ student_id: string }>();

  if (studentError) {
    console.error('학생 권한 조회 실패:', studentError);

    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Discord 연동 실패</h1>
        <p className="mt-2 text-sm text-gray-600">
          학생 권한 확인 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Discord 연동 실패</h1>
        <p className="mt-2 text-sm text-gray-600">
          학생 계정만 Discord 연동이 가능합니다.
        </p>
      </div>
    );
  }

  const { error: upsertError } = await supabase.from('student_discord').upsert(
    {
      student_id: user.id,
      // bigint 정밀도 보존을 위해 문자열로 전달하고 DB에서 bigint로 캐스팅되도록 처리
      discord_id: discordId,
    } as never,
    { onConflict: 'student_id' },
  );

  if (upsertError) {
    console.error('student_discord 저장 실패:', upsertError);

    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Discord 연동 실패</h1>
        <p className="mt-2 text-sm text-gray-600">
          연동 정보 저장에 실패했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Discord 연동 완료</h1>
      <p className="mt-2 text-sm text-gray-600">
        학생 계정과 Discord 계정이 정상적으로 연결되었습니다. 이 페이지를 닫고
        디스코드 봇 인증 완료 버튼을 눌러주세요.
      </p>
    </div>
  );
}
