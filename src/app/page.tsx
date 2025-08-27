// import Detail from '@components/detail/Detail';
import {
  TitleEN,
  Title,
  Heading2,
  Heading,
  Body,
  Label2,
  Label,
  Caption,
} from '@/app/components/system/text';
import ProfileItem from './components/contents/ProfileItem';
import Tag from './components/contents/SkillTag';
import DepartmentTag from './components/contents/DepartmentTag';

export default function Home() {
  return (
    <>
      <div className="w-[300px]">
        {/* <Detail value="TOPCIT 3수준 이상" symbol="license" certified={false} /> */}
        {/* <Detail value="TOPCIT 3수준 이상"  certified={false} /> */}
        {/* <Detail value="TOPCIT 3수준 이상" symbol="prize" edit={true} /> */}
        {/* <Detail value="dd" symbol="link" edit={true} address="https://goolgle.com" /> */}
      </div>
      <div className="examples">
        <TitleEN>TitleEN Example</TitleEN>
        <Title>Title Example</Title>
        <Heading2>Heading2 Example</Heading2>
        <Heading>Heading Example</Heading>
        <Body>Body Example</Body>
        <Label2>Label2 Example</Label2>
        <Label>Label Example</Label>
        <Caption>Caption Example</Caption>
    
        <div className='bg-[#000] w-96 h-96 pt-3 pl-3 flex flex-col gap-3'>
          <div className='w-96 h-48 pt-3 pl-3 flex flex-col gap-1'>
            <Tag mode='default' value='Node.js'/>
            <Tag mode='input' />
            <Tag mode='white' value='Node.js'/>
            <Tag mode='cancel' value='Node.js'/>
          </div>

          <div className='w-96 h-48 pt-3 pl-3 flex flex-col gap-1'>
            <DepartmentTag department={1} />
            <DepartmentTag department={2} />
          </div>

          <div className='w-96 h-32 pt-3 pl-3 flex flex-col gap-1'>
            <ProfileItem mode='competition' value='2024 교내 여름 AI 캠프 장려상' />
            <ProfileItem mode='link' value='obtuse.kr' url='https://obtuse.kr' />
            <ProfileItem mode='certificate' value='정보처리산업기사' />
          </div>
        </div>
      </div>
    </>
  );
}
