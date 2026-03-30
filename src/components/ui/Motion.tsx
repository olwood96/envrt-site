"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

interface MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeUp({ children, className = "", delay = 0 }: MotionProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className = "", delay = 0 }: MotionProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  as?: string;
}

// Helper to get a motion component for a given HTML tag
function getMotionTag(tag: string) {
  return (motion as unknown as Record<string, unknown>)[tag] ?? motion.div;
}

export function StaggerChildren({
  children,
  className = "",
  staggerDelay = 0.08,
  as = "div",
}: StaggerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = getMotionTag(as) as any;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: staggerDelay }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({ children, className = "", as = "div" }: MotionProps & { as?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = getMotionTag(as) as any;
  return (
    <Component
      variants={fadeUp}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </Component>
  );
}
