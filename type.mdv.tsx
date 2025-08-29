"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  markdownText: string;
  className?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  markdownText,
  className = " rounded-lg shadow-md w-full h-[250px]",
}) => {
  const [markdownContent, setMarkdownContent] = useState<string>("");

  useEffect(() => {
    setMarkdownContent("**Loading...**");
    setMarkdownContent(markdownText);
  }, [markdownText]);

  return (
    <div
      className={
        "mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white " +
        className
      }
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
