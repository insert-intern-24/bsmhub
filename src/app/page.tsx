import Detail from './components/shared/Detail';
import Description from './components/shared/Description';

export default function Home() {
	return (
		<>
			<div className='w-[300px]'>
				<Detail value="TOPCIT 3수준 이상" symbol="license" certified={false} />
				{/* <Detail value="TOPCIT 3수준 이상"  certified={false} /> */}
				<Detail value="TOPCIT 3수준 이상" symbol="prize" edit={true}/>
				<Detail value="dd" symbol="link" edit={true} address='https://goolgle.com'/>
			</div>
		</>
	);
}