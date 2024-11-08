import Detail from "./components/Detail";
import Description from './components/Description';

export default function Home() {
  return (
    <>
      <Detail value="TOPCIT 3수준 이상" symbol="license" certified={false}/>
      <Detail value="TOPCIT 3수준 이상" certified={false}/>
      <Detail value="TOPCIT 3수준 이상" symbol="prize" certified={false}/>
    </>
  );
}
