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
      </div>
    </>
  );
}
