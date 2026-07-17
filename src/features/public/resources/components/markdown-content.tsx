"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

const components: Components = {
  h2: ({ children }) => (
    <h2 className="pt-4 font-serif text-2xl text-primary-deep md:text-[2rem]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="pt-2 text-lg font-semibold tracking-tight text-foreground md:text-xl">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-base leading-[1.9] text-foreground/85 md:text-[17px]">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
  ul: ({ children }) => (
    <ul className="list-disc space-y-3 pl-6 marker:text-primary-deep">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-3 pl-6 marker:text-primary-deep">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-base leading-relaxed text-foreground/85 pl-1">
      {children}
    </li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-primary-deep underline underline-offset-2 transition-colors hover:text-primary"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="rounded-[1.75rem] bg-[#f2f6f3] px-8 py-6 font-serif text-xl leading-relaxed text-foreground md:px-10 md:text-2xl">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border" />,
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="space-y-7">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
