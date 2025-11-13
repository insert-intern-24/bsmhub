import Link from "next/link";

const HeroCard = () => {
  return (
    <section className="h-full w-[26rem] mobile:w-full mobile:h-auto bg-white rounded-[0.25rem] border border-gray-200 p-5 flex flex-col justify-between">
      <header className="flex flex-col gap-1">
        <h1 className="text-title-en tracking-[-0.02em]">Build your portfolio</h1>
        <p className="text-body text-gray-600">
          프로젝트, 경력, 기술을 한 곳에. 채용자에게 가장 먼저 보이는 프로필을 만드세요.
        </p>
      </header>

      <div className="flex items-center gap-2 mt-3">
        <Link
          href="/portfolio"
          className="px-3 py-2 rounded-[0.25rem] bg-black text-white text-label"
        >
          포트폴리오 살펴보기
        </Link>
        <Link
          href="/project"
          className="px-3 py-2 rounded-[0.25rem] border border-gray-300 text-label text-gray-800 bg-white"
        >
          프로젝트 올리기
        </Link>
      </div>

      <footer className="mt-3 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
        <span className="text-caption text-gray-500">
          지금도 새로운 포트폴리오가 등록되고 있어요
        </span>
      </footer>
    </section>
  );
};

export default HeroCard;


