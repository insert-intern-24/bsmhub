import Image from 'next/image';
import FilterTag from './FilterTag';
import { Profiles } from '@/app/models/setSearch';

export default function StudentItem({ profile }: { profile: Profiles }) {
  const image_datas = [
    '/images/icon/Sanddeot.svg',
    '/images/icon/Sanddeot.svg',
    '/images/icon/Sanddeot.svg',
  ];

  const tags = ['소프트웨어개발과', '교내 플랫폼', 'Web'];

  return (
    <>
      <div className="flex items-start content-start gap-5 self-stretch flex-wrap h-full w-full sm:min-h-[56.9rem]">
        {profile.map((profile) => (
          <div key={profile.profile_id}>
            <div className="w-full sm:w-[20.185rem] h-fit">
              <div className="w-full h-[17rem] p-2.5 bg-[#FEFEFF] border border-[#E8E8EF] rounded-[5px] relative">
                <div className="w-full h-[5rem] flex flex-row space-x-1">
                  {image_datas.map((src, index) => (
                    <span
                      key={index}
                      className="w-[7.25rem] h-[5rem] rounded-[4px] flex items-center justify-center bg-[#000] overflow-hidden"
                    >
                      <Image src={src} alt="project" width={100} height={92} />
                    </span>
                  ))}
                </div>
                <div className="pl-2.5 flex flex-col gap-1 absolute top-[3.3rem]">
                  <span className="w-fit h-fit rounded-full overflow-hidden">
                    <Image
                      src="/images/profile/default.svg"
                      alt="profile"
                      width={50}
                      height={50}
                    />
                  </span>
                  <div className="mt-1 flex flex-row gap-[0.7rem] items-center">
                    <h5 className="text-titleColor text-lg font-bold">
                      {profile.profile_name}
                    </h5>
                    <h5 className="text-itemBlue text-sm font-semibold">
                      팔로우
                    </h5>
                  </div>
                  <span className="text-descriptionColor text-sm">
                    Lorem ipsum dolor sit amet, cadipiscingt.
                  </span>
                  <span className="text-detailColor text-sm">
                    백엔드 개발자 희망
                  </span>
                  <div className="flex gap-1 mt-2">
                    {' '}
                    {/* tag 같은거 */}
                    {tags.map((tag, index) => (
                      <FilterTag key={index} tag={tag} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center pl-[1.46rem] w-full h-8 bg-[#F9FAFB] border border-[#E8E8EF] rounded-[3px] mt-1.5 text-sm">
                진행 중 프로젝트 /{' '}
                <span className="text-itemBlue ml-[4.5px]">
                  IOJ(Insert Online Judge)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
