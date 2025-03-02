import { MouseEventHandler } from 'react';

const DropdownItem = ({
  children,
  icon,
  onClick,
}: {
  children?: React.ReactNode;
  icon: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      onClick={onClick}
      className="stroke-[0.5px] stroke-gray-500 flex gap-2 items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full"
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 20",
          fontSize: '1.5rem',
        }}
      >
        {icon}
      </span>
      {children}
    </button>
  );
};

export default DropdownItem;
