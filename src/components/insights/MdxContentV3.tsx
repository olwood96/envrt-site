import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponentsV3 } from "./MdxComponentsV3";

interface MdxContentV3Props {
  content: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components = mdxComponentsV3 as any;

export function MdxContentV3({ content }: MdxContentV3Props) {
  return <MDXRemote source={content} components={components} />;
}
