import React, { useState } from 'react'
import { Paperclip, Mic, Send } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import sendMessage from '../features/sendMessage'
import { addMessage } from '../redux/messageSlice';
import { createConversation } from '../features/createConversation';
import { setSelectedConversation ,addConversation} from '../redux/conversationSlice';
import { updateConversation } from '../features/updateConversation';
import { setConvTitle } from '../redux/conversationSlice';


function ChatInput() {
  const [value, setValue] = useState("")
  const dispatch = useDispatch()
  const {selectedConversation} = useSelector((state) => state.conversation)
  const handleSendMessage = async () => {
   let conversation = selectedConversation
   if(!conversation){
    const conv = await createConversation()
    dispatch(setSelectedConversation(conv))
    dispatch(addConversation(conv))
    conversation = conv
   }
  if(conversation.title==="New Conversation"){
    await updateConversation({id:conversation?._id,title:value.trim()})
    dispatch(setConvTitle({conversationId:conversation?._id,title:value.trim()}))
  }

  if (!selectedConversation?._id) return
  const prompt = value.trim()
  if (!prompt) return

  const payload ={
    prompt,
    conversationId:conversation._id
  } 
  
  dispatch(addMessage({ role: "user", content: prompt }))
  setValue("")

  const data = await sendMessage(payload)
  console.log(data)

  if (data?.aiResponse) {
    dispatch(addMessage({ role: "assistant", content: data.aiResponse }))
  }
}

  return (
    <div className='w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0d0f14]'>
      <div className='flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3'>
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
              <Paperclip size={16}/>
            </button>
            <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer'>
              <Mic size={16}/>
            </button>
          </div>
          <button
            disabled={!value.trim()}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none transition-all duration-150 ${
              value.trim()
                ? "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white cursor-pointer"
                : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
            }`}
          >
            <Send size={15}/>
          </button>
        </div>
      </div>
    </div>
  )
}


export default ChatInput