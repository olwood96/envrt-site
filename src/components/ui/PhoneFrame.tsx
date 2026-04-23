"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

const PHONE_VIEWPORT_WIDTH = 375;

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

export function PhoneFrame({ children, className = "" }: PhoneFrameProps) {
  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-[2.8rem] border-[5px] border-envrt-charcoal/90 bg-envrt-charcoal shadow-[0_25px_60px_-10px_rgba(0,0,0,0.4)]">
        {/* Status bar */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between rounded-t-[2.3rem] bg-white px-5"
          style={{ height: 22 }}
        >
          <span className="text-[10px] font-semibold leading-none text-envrt-charcoal">
            21:37
          </span>
          <div className="w-[72px]" />
          <div className="flex items-center gap-[4px]">
            <svg width="12" height="9" viewBox="0 0 14 10" fill="none" className="text-envrt-charcoal">
              <rect x="0" y="7" width="2.5" height="3" rx="0.5" fill="currentColor" />
              <rect x="3.5" y="5" width="2.5" height="5" rx="0.5" fill="currentColor" />
              <rect x="7" y="2.5" width="2.5" height="7.5" rx="0.5" fill="currentColor" />
              <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="currentColor" />
            </svg>
            <svg width="11" height="9" viewBox="0 0 13 10" fill="none" className="text-envrt-charcoal">
              <path d="M6.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor" />
              <path d="M4 7.2a3.5 3.5 0 0 1 5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M1.8 4.8a6.5 6.5 0 0 1 9.4 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="text-[8px] font-medium leading-none text-envrt-charcoal">69</span>
            <div className="flex items-center gap-[1px]">
              <div className="relative h-[8px] w-[17px] rounded-[2px] border border-envrt-charcoal/80">
                <div className="absolute inset-[1px] rounded-[1px] bg-envrt-charcoal" style={{ width: "69%" }} />
              </div>
              <div className="h-[3px] w-[1px] rounded-r-full bg-envrt-charcoal/80" />
            </div>
          </div>
        </div>

        {/* Dynamic island */}
        <div className="absolute left-1/2 top-[4px] z-30 h-[16px] w-[72px] -translate-x-1/2 rounded-full bg-envrt-charcoal" />

        {/* Screen */}
        <div className="relative w-full overflow-hidden rounded-[2.3rem] bg-white" style={{ aspectRatio: "9 / 19" }}>
          <div className="absolute inset-0 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Phone frame with a scaled iframe inside, identical to the hero phone mockup.
 * Uses ResizeObserver to scale the 375px-wide iframe to fit the phone screen.
 */
interface PhoneIframeProps {
  src: string;
  className?: string;
}

export function PhoneIframe({ src, className = "" }: PhoneIframeProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      if (screenRef.current) {
        setScale(screenRef.current.offsetWidth / PHONE_VIEWPORT_WIDTH);
      }
    };
    update();
    const observer = new ResizeObserver(update);
    if (screenRef.current) observer.observe(screenRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-[2.8rem] border-[5px] border-envrt-charcoal/90 bg-envrt-charcoal shadow-[0_25px_60px_-10px_rgba(0,0,0,0.4)]">
        {/* Status bar */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between rounded-t-[2.3rem] bg-white px-5"
          style={{ height: 22 }}
        >
          <span className="text-[10px] font-semibold leading-none text-envrt-charcoal">
            21:37
          </span>
          <div className="w-[72px]" />
          <div className="flex items-center gap-[4px]">
            <svg width="12" height="9" viewBox="0 0 14 10" fill="none" className="text-envrt-charcoal">
              <rect x="0" y="7" width="2.5" height="3" rx="0.5" fill="currentColor" />
              <rect x="3.5" y="5" width="2.5" height="5" rx="0.5" fill="currentColor" />
              <rect x="7" y="2.5" width="2.5" height="7.5" rx="0.5" fill="currentColor" />
              <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="currentColor" />
            </svg>
            <svg width="11" height="9" viewBox="0 0 13 10" fill="none" className="text-envrt-charcoal">
              <path d="M6.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor" />
              <path d="M4 7.2a3.5 3.5 0 0 1 5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M1.8 4.8a6.5 6.5 0 0 1 9.4 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="text-[8px] font-medium leading-none text-envrt-charcoal">69</span>
            <div className="flex items-center gap-[1px]">
              <div className="relative h-[8px] w-[17px] rounded-[2px] border border-envrt-charcoal/80">
                <div className="absolute inset-[1px] rounded-[1px] bg-envrt-charcoal" style={{ width: "69%" }} />
              </div>
              <div className="h-[3px] w-[1px] rounded-r-full bg-envrt-charcoal/80" />
            </div>
          </div>
        </div>

        {/* Dynamic island */}
        <div className="absolute left-1/2 top-[4px] z-30 h-[16px] w-[72px] -translate-x-1/2 rounded-full bg-envrt-charcoal" />

        {/* Screen with scaled iframe */}
        <div
          ref={screenRef}
          className="relative w-full overflow-hidden rounded-[2.3rem] bg-white"
          style={{ aspectRatio: "9 / 19" }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src={src}
              title="Digital Product Passport"
              loading="lazy"
              className="absolute border-0"
              style={{
                top: 0,
                left: 0,
                width: `${PHONE_VIEWPORT_WIDTH}px`,
                height: 812,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                overflow: "hidden",
                paddingTop: "22px",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
