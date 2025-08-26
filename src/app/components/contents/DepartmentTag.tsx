import React from "react"

const DepartmentTag = ({department}: {department: number}) => {

  const mapDepartment: Record<number, string> = {
    1: '소프트웨어개발과',
    2: '임베디드소프트웨어과'
  }

  return (
    <div 
      className='inline-flex justify-center items-center px-3 py-1
       bg-white text-gray-base outline-light-gray-outline border-[0.8px] rounded-full'
    >
      {mapDepartment[department] || '존재하지 않는 학과입니다.'}
    </div>
  )
}

export default DepartmentTag;