import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * Clean phone mockup shell. Rounded bezel, no status bar or dynamic island.
 */
export function PhoneFrame({ children, className = "" }: PhoneFrameProps) {
  return (
    <div className={`relative mx-auto w-full max-w-[280px] lg:max-w-[300px] ${className}`}>
      <div className="relative overflow-hidden rounded-[2.2rem] border-[4px] border-envrt-charcoal/90 bg-envrt-charcoal shadow-[0_25px_60px_-10px_rgba(0,0,0,0.4)]">
        <div className="relative w-full overflow-hidden rounded-[1.8rem] bg-white" style={{ aspectRatio: "9 / 19" }}>
          <div className="absolute inset-0 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
