const OverlayBg = ({
  children,
  backgroundColor = '#00000085',
  onBackgroundClick,
}: {
  children?: React.ReactNode;
  backgroundColor?: string;
  onBackgroundClick?: () => void;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onBackgroundClick) {
      onBackgroundClick();
    }
  };

  return (
    <div
      className="fixed w-[100vw] h-[100vh] top-0 left-0 flex justify-center items-center z-50"
      style={{ backgroundColor }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default OverlayBg;
