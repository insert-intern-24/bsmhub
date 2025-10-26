'use client';
import Dropdown, { DropdownItem } from '../dropdown/DropDown';
import { Label } from '../system/text';

export default function HeaderDropdown() {
  return (
    <Dropdown trigger={<Label>+ 만들기</Label>}>
      <DropdownItem onSelect={() => console.log('매뉴를 클릭했습니다.')}>
        메뉴
      </DropdownItem>
    </Dropdown>
  );
}
