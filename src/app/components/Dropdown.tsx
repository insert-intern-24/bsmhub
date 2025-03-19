import type { Dropdown } from '../models/dropdown';
import OverlayBg from './layout/overlay/OverlayBg';
import DropdownItem from './DropdownItem';

interface DropdownProps extends Dropdown {
  OverayBgColor?: string;
}

const Dropdown = (dropdown: DropdownProps) => {
  return (
    <>
      {dropdown.setOverlayBg && (
        <OverlayBg
          backgroundColor={dropdown.OverayBgColor || '#00000000'}
          onBackgroundClick={() => {
            if (dropdown.setOverlayBg) dropdown.setOverlayBg(false);
          }}
        />
      )}
      <div className="absolute right-0 bg-white rounded-lg p-2 shadow-md min-w-[14rem] border-gray-500 border-[0.5px] z-50">
        {dropdown.items.map((item, index) => (
          <DropdownItem key={index} icon={item.icon} onClick={item.onClick}>
            {item.children}
          </DropdownItem>
        ))}
      </div>
    </>
  );
};

export default Dropdown;
