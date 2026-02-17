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

/**
 * Custom components for rendering MDX content.
 * These map standard markdown elements to styled React components
 * that match the ENVRT design system.
 */
export const mdxComponents = {
  h1: ({ children, ...rest }: MdxProps) => (
    <h1
      {...rest}
      className="text-3xl font-bold tracking-tight text-envrt-charcoal mt-10 mb-4 first:mt-0"
    >
      {children}
    </h1>
  ),

  h2: ({ children, ...rest }: MdxProps) => {
    const id =
      typeof children === "string"
        ? children.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        : undefined;
    return (
      <h2 {...rest} id={id} className="text-2xl font-bold tracking-tight text-envrt-charcoal mt-10 mb-3 scroll-mt-24">
        {children}
      </h2>
    );
  },

  h3: ({ children, ...rest }: MdxProps) => {
    const id =
      typeof children === "string"
        ? children.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        : undefined;
    return (
      <h3 {...rest} id={id} className="text-xl font-semibold text-envrt-charcoal mt-8 mb-3 scroll-mt-24">
        {children}
      </h3>
    );
  },

  p: ({ children, ...rest }: MdxProps) => (
    <p {...rest} className="text-base leading-relaxed text-envrt-charcoal/75 mb-5">
      {children}
    </p>
  ),

  a: ({ children, href, ...rest }: MdxLinkProps) => (
    <a
      {...rest}
      href={href}
      className="text-envrt-teal underline decoration-envrt-teal/30 underline-offset-4 transition-colors hover:decoration-envrt-teal"
      target={typeof href === "string" && href.startsWith("http") ? "_blank" : undefined}
      rel={typeof href === "string" && href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),

  ul: ({ children, ...rest }: MdxProps) => (
    <ul {...rest} className="mb-5 space-y-2 pl-1">
      {children}
    </ul>
  ),

  ol: ({ children, ...rest }: MdxProps) => (
    <ol {...rest} className="mb-5 space-y-2 pl-1 list-decimal list-inside">
      {children}
    </ol>
  ),

  li: ({ children }: MdxProps) => (
    <li className="flex items-start gap-2.5 text-base leading-relaxed text-envrt-charcoal/75">
      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-envrt-teal/50" />
      <span>{children}</span>
    </li>
  ),

  blockquote: ({ children, ...rest }: MdxProps) => (
    <blockquote
      {...rest}
      className="my-6 border-l-2 border-envrt-teal/40 pl-5 text-base italic text-envrt-charcoal/60"
    >
      {children}
    </blockquote>
  ),

  code: ({ children, ...rest }: MdxProps) => (
    <code
      {...rest}
      className="rounded bg-envrt-charcoal/5 px-1.5 py-0.5 text-sm font-mono text-envrt-charcoal/80"
    >
      {children}
    </code>
  ),

  pre: ({ children, ...rest }: MdxProps) => (
    <pre
      {...rest}
      className="my-6 overflow-x-auto rounded-lg bg-envrt-charcoal p-4 text-sm leading-relaxed text-white"
    >
      {children}
    </pre>
  ),

  hr: () => <hr className="my-10 border-envrt-charcoal/10" />,

  img: ({ alt, ...rest }: MdxImgProps) => (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...rest} alt={alt ?? ""} className="w-full rounded-lg" loading="lazy" />
      {alt && (
        <figcaption className="mt-2 text-center text-xs text-envrt-muted">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  table: ({ children, ...rest }: MdxProps) => (
    <div className="my-6 overflow-x-auto">
      <table {...rest} className="w-full text-sm text-envrt-charcoal/75">
        {children}
      </table>
    </div>
  ),

  th: ({ children, ...rest }: MdxProps) => (
    <th
      {...rest}
      className="border-b border-envrt-charcoal/10 px-3 py-2 text-left font-semibold text-envrt-charcoal"
    >
      {children}
    </th>
  ),

  td: ({ children, ...rest }: MdxProps) => (
    <td {...rest} className="border-b border-envrt-charcoal/5 px-3 py-2">
      {children}
    </td>
  ),
};
