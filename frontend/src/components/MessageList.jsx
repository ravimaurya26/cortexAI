import React from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";

function MessageList() {
    const { selectedConversation } = useSelector(
        (state) => state.conversation
    );

    const { messages = [] } = useSelector(
        (state) => state.message
    );

    const safeMessages = Array.isArray(messages) ? messages : [];

    return (
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            {safeMessages.length === 0 || !selectedConversation ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">

                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[20px] font-semibold text-slate-200 tracking-tight">
                            CortexAI
                        </h1>

                        <p className="text-[15px] font-semibold text-slate-200 tracking-tight">
                            Welcome to CortexAI!
                        </p>

                        <p className="text-[13px] text-slate-600 max-w-[260px] leading-relaxed">
                            Ask me anything — code, ideas, explanations, or just chat!
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {[
                            "Write a Netflix Clone",
                            "Explain Docker",
                            "Build Dashboard",
                        ].map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                className="text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-200 cursor-pointer"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-5">
                    {safeMessages.map((msg, index) => (
                        <div
                            key={
                                msg.id ??
                                msg._id ??
                                `${msg.role}-${index}`
                            }
                        >
                            <MessageBubble
                                role={msg.role}
                                content={
                                    typeof msg.content === "string"
                                        ? msg.content
                                        : ""
                                }
                                images={
                                    Array.isArray(msg.images)
                                        ? msg.images
                                        : []
                                }
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MessageList;

