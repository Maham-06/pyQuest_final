"use client"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "../context/ThemeContext"

const LevelContent = ({ content }) => {
  const { theme } = useTheme()

  // Ensure content is a string
  const safeContent =
    typeof content === "string" ? content : content ? JSON.stringify(content, null, 2) : "# No content available"

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  )
}

export default LevelContent
