import { ReactNode } from "react";

interface LaptopFrameProps {
  children: ReactNode;
  className?: string;
}

export function LaptopFrame({ children, className = "" }: LaptopFrameProps) {
  return (
    <div className={className}>
      {/* Screen */}
      <div className="relative">
        <div className="overflow-hidden rounded-t-xl border-[3px] border-b-0 border-envrt-charcoal/90 bg-envrt-charcoal">
          {/* Camera */}
          <div className="flex justify-center py-1.5">
            <div className="h-[4px] w-[4px] rounded-full bg-gray-600 ring-1 ring-white/10" />
          </div>
          {/* Screen area */}
          <div
            className="relative mx-1 mb-1 overflow-hidden rounded-sm"
            style={{
              aspectRatio: "16 / 10",
              background: "linear-gradient(135deg, #1a3a2a 0%, #0f2219 100%)",
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Keyboard base */}
      <div className="relative mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-xl bg-gradient-to-b from-[#d1d1d6] to-[#b8b8be] shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
        <div className="absolute inset-x-[38%] top-[3px] h-[1px] rounded-full bg-black/10" />
      </div>
    </div>
  );
}
