import React, { useState } from "react";
import Markdown from "react-markdown";
import {
    Check,
    Copy,
    ExternalLink,
    X,
} from "lucide-react";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function MessageBubble({ role, content = "", images = [] }) {
    const isUser = role === "user";

    const [lightBox, setLightBox] = useState(null);
    const [copiedCode, setCopiedCode] = useState("");

    // Copy code to clipboard
    const copyCode = async (code) => {
        try {
            await navigator.clipboard.writeText(code);

            setCopiedCode(code);

            setTimeout(() => {
                setCopiedCode("");
            }, 2000);
        } catch (error) {
            console.error("Failed to copy code:", error);
        }
    };

    // Safely handle message content and images
    const safeContent = typeof content === "string" ? content : "";
    const safeImages = Array.isArray(images) ? images : [];

    return (
        <div
            className={`flex ${
                isUser ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`w-fit max-w-[92vw] md:max-w-[72%] px-4 py-2.5 rounded-2xl break-words overflow-hidden leading-relaxed ${
                    isUser
                        ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
                        : "text-slate-200 rounded-tl-sm"
                }`}
            >
                {/* Display images */}
                {safeImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                        {safeImages.map((img, index) => (
                            <img
                                key={`${img}-${index}`}
                                src={img}
                                alt={`Message attachment ${index + 1}`}
                                onClick={() => setLightBox(img)}
                                loading="lazy"
                                onError={(event) =>
                                    event.currentTarget.remove()
                                }
                                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-80 transition"
                            />
                        ))}
                    </div>
                )}

                {/* Render Markdown */}
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => (
                            <h1 className="text-2xl font-bold mt-5 mb-3">
                                {children}
                            </h1>
                        ),

                        h2: ({ children }) => (
                            <h2 className="text-xl font-semibold mt-4 mb-2">
                                {children}
                            </h2>
                        ),

                        h3: ({ children }) => (
                            <h3 className="text-lg font-semibold mt-3 mb-2">
                                {children}
                            </h3>
                        ),

                        p: ({ children }) => (
                            <p className="mb-3 whitespace-pre-wrap break-words last:mb-0">
                                {children}
                            </p>
                        ),

                        ul: ({ children }) => (
                            <ul className="list-disc pl-5 space-y-1 my-2">
                                {children}
                            </ul>
                        ),

                        ol: ({ children }) => (
                            <ol className="list-decimal pl-5 space-y-1 my-2">
                                {children}
                            </ol>
                        ),

                        li: ({ children }) => (
                            <li className="break-words">
                                {children}
                            </li>
                        ),

                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-indigo-500 pl-4 my-3 text-slate-400">
                                {children}
                            </blockquote>
                        ),

                        table: ({ children }) => (
                            <div className="overflow-x-auto my-4">
                                <table className="min-w-full border-collapse border border-white/10">
                                    {children}
                                </table>
                            </div>
                        ),

                        th: ({ children }) => (
                            <th className="border border-white/10 bg-white/5 px-3 py-2 text-left">
                                {children}
                            </th>
                        ),

                        td: ({ children }) => (
                            <td className="border border-white/10 px-3 py-2">
                                {children}
                            </td>
                        ),

                        a: ({ href, children }) => (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 underline inline-flex items-center gap-1"
                            >
                                {children}
                                <ExternalLink size={14} />
                            </a>
                        ),

                        // Inline code and code blocks
                        code: ({ className, children }) => {
                            const value = String(children).replace(/\n$/, "");

                            // Inline code
                            if (!className?.includes("language-")) {
                                return (
                                    <code className="px-1.5 py-0.5 rounded bg-white/10 text-indigo-200 break-words">
                                        {children}
                                    </code>
                                );
                            }

                            // Code block
                            const language = className
                                .replace("language-", "")
                                .trim();

                            return (
                                <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318]">
                                    {/* Code block header */}
                                    <div className="flex items-center justify-between gap-3 bg-[#1b1d24] border-b border-white/10 px-4 py-2">
                                        <span className="uppercase text-xs text-slate-400">
                                            {language}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => copyCode(value)}
                                            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors"
                                            aria-label="Copy code"
                                        >
                                            {copiedCode === value ? (
                                                <>
                                                    <Check size={14} />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={14} />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Syntax highlighting */}
                                    <SyntaxHighlighter
                                        language={language}
                                        style={oneDark}
                                        wrapLongLines
                                        showLineNumbers
                                        customStyle={{
                                            margin: 0,
                                            padding: "16px",
                                            background: "#0d1117",
                                            fontSize: "13px",
                                            overflowX: "auto",
                                        }}
                                    >
                                        {value}
                                    </SyntaxHighlighter>
                                </div>
                            );
                        },

                        img:({src})=>{
                            if(!src) return null;
                            return(
                                <img
                                src={src}
                                onClick={()=>setLightBox(src)}
                                loading="lazy"
                                onError={(e)=> e.currentTarget.remove()}
                                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
                                />
                            )
                        }

                    }}
                >
                    {safeContent}
                </Markdown>
            </div>

            {/* Image lightbox */}
            {lightBox && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                    onClick={() => setLightBox(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image preview"
                >
                    <button
                        type="button"
                        className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
                        onClick={() => setLightBox(null)}
                        aria-label="Close image preview"
                    >
                        <X />
                    </button>

                    <img
                        src={lightBox}
                        alt="Enlarged message attachment"
                        onClick={(event) => event.stopPropagation()}
                        className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
                    />
                </div>
            )}
        </div>
    );
}

export default MessageBubble;