import React, { useEffect, useState } from 'react';
import { PanelLeftIcon, PenSquare, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import { getConversations } from '../features/getConversations';
import { createConversation } from '../features/createConversation';
import {
  setConversation,
  addConversation,
} from '../redux/conversationSlice';

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);

  const dispatch = useDispatch();

  const { conversations } = useSelector(
    (state) => state.conversation
  );

  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();

      if (data) {
        dispatch(setConversation(data));
      }
    };

    getConv();
  }, [dispatch]);

  const handleNewChat = async () => {
    const data = await createConversation();

    if (data) {
      dispatch(addConversation(data));
    }
  };

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 h-screen
      bg-[#0d0f14] border-r border-white/[0.06]
      ${collapsed ? 'w-0 overflow-hidden' : 'w-[250px]'}`}
    >
      <div className="flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">

          <div
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg
            text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]
            transition-colors duration-150 bg-transparent border-none cursor-pointer"
            onClick={() => setCollapsed(true)}
          >
            <PanelLeftIcon size={18} />
          </div>

          <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
            CortexAI
          </span>

          <span
            className="text-[10px] font-medium text-indigo-400
            bg-indigo-500/10 border border-indigo-500/20
            px-2 py-0.5 rounded-full tracking-wide"
          >
            free
          </span>

          <button
            className="flex items-center justify-center w-7 h-7 rounded-lg
            text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]
            transition-colors duration-150 bg-transparent border-none cursor-pointer"
            onClick={handleNewChat}
          >
            <PenSquare size={16} />
          </button>

        </div>

        {/* New Chat */}
        <div className="px-4 pt-4 pb-1">

          <button
            className="w-full flex items-center justify-center gap-2
            py-2.5 rounded-lg text-[15px] font-semibold text-white
            bg-gradient-to-r from-indigo-500 to-violet-500
            hover:from-indigo-400 hover:to-violet-400
            shadow-lg shadow-indigo-500/25
            hover:shadow-indigo-500/40
            transition-all duration-200 hover:-translate-y-0.5
            border-none cursor-pointer"
            onClick={handleNewChat}
          >
            <Plus size={15} />
            New Chat
          </button>

        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-3 pt-4">

          {conversations.length > 0 ? (
            <>
              <div
                className="px-2 pb-2 text-[10.5px] font-semibold
                uppercase tracking-widest text-slate-600"
              >
                Recent Conversations
              </div>

              <div className="space-y-1">

                {conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    className="px-3 py-2.5 rounded-lg
                    text-sm text-slate-300
                    hover:bg-white/[0.05]
                    hover:text-slate-100
                    cursor-pointer transition-colors"
                  >
                    {conversation.title || 'New Conversation'}
                  </div>
                ))}

              </div>
            </>
          ) : (
            <div
              className="px-2 pt-2 text-[11px]
              text-slate-600 text-center"
            >
              No Recent Conversations
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default SideBar;