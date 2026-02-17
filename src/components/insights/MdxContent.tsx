import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "./MdxComponents";

interface MdxContentProps {
  content: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components = mdxComponents as any;

export function MdxContent({ content }: MdxContentProps) {
  return <MDXRemote source={content} components={components} />;
}
