export interface DropdownItem {
  icon: string;
  onClick: () => void;
  children: React.ReactNode;
}

export interface Dropdown {
  setOverlayBg?: React.Dispatch<React.SetStateAction<boolean>>;
  items: Array<DropdownItem>;
}
