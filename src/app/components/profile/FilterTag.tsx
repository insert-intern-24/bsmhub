const FilterTag = ({tag}: {tag: string}) => {
  return (
    <span className="px-3 py-1 rounded-[1000px] border border-[#E5E5E5] text-xs text-detailColor flex-shrink-0">
      {tag}
    </span>
  )
}

export default FilterTag