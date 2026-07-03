export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-5">
        {/* Animated wordmark */}
        <span
          className="text-[28px] font-bold text-black tracking-tight animate-pulse"
          style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
        >
          blackant
        </span>
        {/* Minimal line loader */}
        <div className="w-32 h-px bg-[#e5e5e5] overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-black animate-[slide_1.2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
