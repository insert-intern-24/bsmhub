'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from 'react';

type ClassValue = string | null | undefined | false;

const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(' ');

interface DropdownContextValue {
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

export type DropdownAlign = 'left' | 'right';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: DropdownAlign;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dropdown = ({
  trigger,
  children,
  align = 'left',
  className,
  triggerClassName,
  menuClassName,
  open,
  defaultOpen,
  onOpenChange,
}: DropdownProps) => {
  const isControlled = typeof open === 'boolean';
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();

  const currentOpen = isControlled ? open : internalOpen;

  const setOpenState = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
      if (!nextOpen) {
        triggerRef.current?.focus();
      }
    },
    [isControlled, onOpenChange],
  );

  const toggleOpen = useCallback(() => {
    setOpenState(!currentOpen);
  }, [currentOpen, setOpenState]);

  useEffect(() => {
    if (!currentOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (
        target &&
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        setOpenState(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenState(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [currentOpen, setOpenState]);

  const triggerElement = useMemo(
    () => (
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          'flex items-center justify-between rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-black',
          triggerClassName,
        )}
        onClick={toggleOpen}
        aria-haspopup="menu"
        aria-expanded={currentOpen}
        aria-controls={currentOpen ? menuId : undefined}
      >
        {trigger}
      </button>
    ),
    [trigger, triggerClassName, toggleOpen, currentOpen, menuId],
  );

  const contextValue = useMemo(
    () => ({ close: () => setOpenState(false) }),
    [setOpenState],
  );

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {triggerElement}
      {currentOpen ? (
        <DropdownContext.Provider value={contextValue}>
          <div
            id={menuId}
            role="menu"
            aria-orientation="vertical"
            className={cn(
              'absolute z-20 w-auto min-w-[120px] rounded-md border border-light-gray-outline bg-white p-2 shadow-md focus:outline-none',
              align === 'right' ? 'right-0' : 'left-0',
              menuClassName,
            )}
          >
            {children}
          </div>
        </DropdownContext.Provider>
      ) : null}
    </div>
  );
};

interface DropdownItemProps {
  children: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  closeOnSelect?: boolean;
  className?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const DropdownItem = ({
  children,
  onSelect,
  disabled = false,
  closeOnSelect = true,
  className,
  leadingIcon,
  trailingIcon,
}: DropdownItemProps) => {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('DropdownItem must be used within a Dropdown.');
  }

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onSelect?.();

    if (closeOnSelect) {
      context.close();
    }
  };

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm text-gray-700 transition-colors duration-150',
        disabled
          ? 'cursor-not-allowed text-gray-base'
          : 'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
        className,
      )}
    >
      {leadingIcon ? (
        <span className="flex h-4 w-4 items-center justify-center">
          {leadingIcon}
        </span>
      ) : null}
      <span className="flex-1">{children}</span>
      {trailingIcon ? (
        <span className="flex h-4 w-4 items-center justify-center">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
};

export default Dropdown;
