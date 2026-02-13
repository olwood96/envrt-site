import { ReactNode } from "react";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
}

export function SectionCard({
  children,
  className = "",
  dark = false,
  id,
}: SectionCardProps) {
  return (
    <section
      id={id}
      className={`${dark ? "scene-card-dark" : "scene-card"} noise-overlay ${className}`}
    >
      {children}
    </section>
  );
}
