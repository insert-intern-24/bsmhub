export default function BoxLayoutWithMobileMargin({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-[100dvw] relative -left-4 -top-4 mobile:h-32 bg-[#F5F5F7] h-0"></div>
        {children}
    </>
  );
}