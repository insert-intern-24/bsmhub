import React from 'react';
import Image from 'next/image'; // Next.js Image 컴포넌트
import defaultImg from '@public/images/project/default.png';
interface ProjectItemProps {
	url?: string | null; // URL이 비어 있을 경우 처리
	tag: string;
	category: string;
	title: string;
	description: string;
}

function ProjectItem({ url, tag, category, title, description }: ProjectItemProps) {
	const imageUrl = url || defaultImg;

	return (
		<div className="w-fit h-fit">
			<div className="w-[21.0625rem] h-[11.8125rem] bg-[#F1F1F1] rounded-2xl overflow-hidden">
				<Image className="rounded-2xl" src={imageUrl} alt="Project Image" layout="responsive" width={337} height={189} />
			</div>
			<div className="mt-[-26px]">
				<span className="text-xs ml-3 px-4 py-[0.125rem] bg-white text-titleColor rounded-3xl">{tag}</span>
				<p className="text-[#1462FF] mt-5 text-14">{category}</p>
				<h5 className="text-titleColor font-bold text-2xl">{title}</h5>
				<p className="text-descriptionColor text-4">{description}</p>
			</div>
		</div>
	);
}

export default ProjectItem;
