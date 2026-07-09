import type { ReactNode } from "react";

interface MdxProps {
  children?: ReactNode;
  [key: string]: unknown;
}

interface MdxLinkProps extends MdxProps {
  href?: string;
}

interface MdxImgProps extends MdxProps {
  alt?: string;
  src?: string;
}

function headingId(children: ReactNode) {
  return typeof children === "string"
    ? children
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    : undefined;
}

// v3 prose components for article body content. Matches the prose
// typography subsection of docs/ui-styleguide-v3.md. Reads on a
// 720px column, leading 1.7, brand-black ink, ultramarine accents.

export const mdxComponentsV3 = {
  h1: ({ children, ...rest }: MdxProps) => (
    <h1
      {...rest}
      id={headingId(children)}
      className="scroll-mt-28 mt-14 mb-5 font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-envrt-brand-black first:mt-0 sm:text-[2rem]"
    >
      {children}
    </h1>
  ),

  h2: ({ children, ...rest }: MdxProps) => (
    <h2
      {...rest}
      id={headingId(children)}
      className="scroll-mt-28 mt-14 mb-5 font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-envrt-brand-black first:mt-0 sm:text-[2rem]"
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...rest }: MdxProps) => (
    <h3
      {...rest}
      id={headingId(children)}
      className="scroll-mt-28 mt-10 mb-4 font-display text-xl font-medium leading-[1.2] tracking-tight text-envrt-brand-black sm:text-2xl"
    >
      {children}
    </h3>
  ),

  p: ({ children, ...rest }: MdxProps) => (
    <p
      {...rest}
      className="mb-6 text-[17px] leading-[1.7] text-envrt-brand-black/80 sm:text-lg"
    >
      {children}
    </p>
  ),

  a: ({ children, href, ...rest }: MdxLinkProps) => (
    <a
      {...rest}
      href={href}
      className="text-envrt-brand-ultramarine underline decoration-envrt-brand-ultramarine/30 underline-offset-[5px] transition-colors hover:decoration-envrt-brand-ultramarine"
      target={typeof href === "string" && href.startsWith("http") ? "_blank" : undefined}
      rel={typeof href === "string" && href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),

  strong: ({ children, ...rest }: MdxProps) => (
    <strong {...rest} className="font-semibold text-envrt-brand-black">
      {children}
    </strong>
  ),

  em: ({ children, ...rest }: MdxProps) => (
    <em {...rest} className="italic text-envrt-brand-black/85">
      {children}
    </em>
  ),

  ul: ({ children, ...rest }: MdxProps) => (
    <ul {...rest} className="mb-6 space-y-2.5 pl-1">
      {children}
    </ul>
  ),

  ol: ({ children, ...rest }: MdxProps) => (
    <ol {...rest} className="mb-6 list-decimal space-y-2.5 pl-6 marker:text-envrt-brand-ultramarine/70">
      {children}
    </ol>
  ),

  li: ({ children }: MdxProps) => (
    <li className="flex items-start gap-3 text-[17px] leading-[1.65] text-envrt-brand-black/80 sm:text-lg">
      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-envrt-brand-ultramarine/60" />
      <span>{children}</span>
    </li>
  ),

  blockquote: ({ children, ...rest }: MdxProps) => (
    <blockquote
      {...rest}
      className="my-10 border-l-2 border-envrt-brand-ultramarine pl-6 font-display text-xl font-medium leading-[1.4] tracking-[-0.01em] text-envrt-brand-black/85 sm:text-2xl"
    >
      {children}
    </blockquote>
  ),

  code: ({ children, ...rest }: MdxProps) => (
    <code
      {...rest}
      className="rounded bg-envrt-brand-black/[0.06] px-1.5 py-0.5 font-mono text-[0.92em] text-envrt-brand-black/85"
    >
      {children}
    </code>
  ),

  pre: ({ children, ...rest }: MdxProps) => (
    <pre
      {...rest}
      className="my-8 overflow-x-auto rounded-2xl bg-envrt-brand-black p-5 text-sm leading-relaxed text-white"
    >
      {children}
    </pre>
  ),

  hr: () => <hr className="my-12 border-envrt-brand-black/10" />,

  img: ({ alt, ...rest }: MdxImgProps) => (
    <figure className="my-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...rest}
        alt={alt ?? ""}
        className="w-full rounded-2xl border border-envrt-brand-black/8"
        loading="lazy"
      />
      {alt && (
        <figcaption className="mt-3 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/50">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  table: ({ children, ...rest }: MdxProps) => (
    <div className="my-8 overflow-x-auto rounded-2xl border border-envrt-brand-black/10">
      <table {...rest} className="w-full text-[15px] text-envrt-brand-black/80">
        {children}
      </table>
    </div>
  ),

  th: ({ children, ...rest }: MdxProps) => (
    <th
      {...rest}
      className="border-b border-envrt-brand-black/10 bg-envrt-brand-black/[0.03] px-4 py-3 text-left font-display font-medium text-envrt-brand-black"
    >
      {children}
    </th>
  ),

  td: ({ children, ...rest }: MdxProps) => (
    <td {...rest} className="border-b border-envrt-brand-black/5 px-4 py-3 last:border-0">
      {children}
    </td>
  ),
};
