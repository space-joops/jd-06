"use client";

export default function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-30">
      <button
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="닫기"
      />
      <div className="anim-slideup absolute inset-x-0 bottom-0 max-h-[78%] overflow-y-auto rounded-t-3xl bg-space-700 p-5 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm text-white/80 transition active:scale-95"
          >
            닫기
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
