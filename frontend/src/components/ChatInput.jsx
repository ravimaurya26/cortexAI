import React, { useState } from 'react'
import { Paperclip, Mic, Send, Zap, Images } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import sendMessage from '../features/sendMessage'
import { addMessage } from '../redux/messageSlice';
import { createConversation } from '../features/createConversation';
import { setSelectedConversation, addConversation } from '../redux/conversationSlice';
import { updateConversation } from '../features/updateConversation';
import { setConvTitle } from '../redux/conversationSlice';
import { MessageSquare, Code2, ImageIcon, Globe, FileText, PresentationIcon } from "lucide-react";




function ChatInput() {
  const [value, setValue] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("Auto")
  const { selectedConversation } = useSelector((state) => state.conversation)
  const dispatch = useDispatch()
  const handleSendMessage = async () => {
    let conversation = selectedConversation
    if (!conversation) {
      const conv = await createConversation()
      dispatch(setSelectedConversation(conv))
      dispatch(addConversation(conv))
      conversation = conv
    }
    if (conversation.title === "New Conversation") {
      await updateConversation({ id: conversation?._id, title: value.trim() })
      dispatch(setConvTitle({ conversationId: conversation?._id, title: value.trim() }))
    }

    if (!selectedConversation?._id) return
    const prompt = value.trim()
    if (!prompt) return

    const payload = {
      prompt,
      conversationId: conversation._id,agent: selectedAgent.toLowerCase()
    }

    dispatch(addMessage({ role: "user", content: prompt }))
    setValue("")

    const data = await sendMessage(payload)
    console.log(data)

    if (data?.aiResponse) {
      dispatch(addMessage({ role: "assistant", content: data.answer ,images:data.images }))
    }
  }

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto"
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat"
    }
    , {
      id: "coding",
      icon: Code2,
      label: "Coding"
    },
    {
      id: "image",
      icon: ImageIcon,
      label: "Image"
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF"
    },
    {
      id: "ppt",
      icon: PresentationIcon,
      label: "PPT"
    },
    {
      id: "search",
      icon: Globe,
      label: "search"
    }
  ]

  return (
    <div className='w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0d0f14]'>
      <div className='flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3'>

        <div className='flex w-full gap-2 pr-2 flex-nowrap overflow-x-auto'>
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label
            const Icon = agent.icon
            return (

              <div
               key={agent.id}
               onClick={() => setSelectedAgent(agent.label)}
               className={`flex-shrink-0
                inline-flex
                cursor-pointer
                items-center
                gap-1.5
                px-3
                py-2
                rounded-full
                text-xs
                font-medium
                border
                transition-all

                ${isActive
                  ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_0_rgba(99,102,241,0.5)]"
                  : "bg-white/[0.03] text-slate-400 border-white/[0.06]  hover:bg-white/[0.07]" 
                  
                }
              `}>
                <Icon size={12}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-500"
                  } />
                {agent.label}

              </div>
            )
          })}

        </div>

        <textarea
          placeholder='Ask Anything...'
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={3}
        />
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer'>
              <Paperclip size={16} />
            </button>
            <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer'>
              <Mic size={16} />
            </button>
          </div>
          <button
            disabled={!value.trim()}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none transition-all duration-150 ${value.trim()
                ? "bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 text-white cursor-pointer"
                : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
              }`}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}


export default ChatInput