import React, { useEffect, useState } from 'react';
import {
  Coins,
  LogOut,
  PanelLeftIcon,
  PanelRight,
  PenSquare,
  Plus,
  User,
  MessageSquare,
} from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';

import { getConversations } from '../features/getConversations';
import { createConversation } from '../features/createConversation';

import {
  setConversation,
  addConversation,
  setSelectedConversation
} from '../redux/conversationSlice';

import logOut from '../features/logOut';
import { setUserdata } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';


function SideBar() {

  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const dispatch = useDispatch();

  const {
    conversations,
    selectedConversation
  } = useSelector((state) => state.conversation);

  const {
    userData
  } = useSelector((state) => state.user);


  useEffect(() => {

    const getConv = async () => {

      const data = await getConversations();

      if (data) {
        dispatch(setConversation(data));
      }

    };

    getConv();

  }, [userData?._id]);


  const handleNewChat = async () => {

    if (isCreating) return;
    setIsCreating(true);

    const data = await createConversation();

    if (data) {
      dispatch(addConversation(data));
      dispatch(setSelectedConversation(data));
      dispatch(setMessages([]));
    }

    setIsCreating(false);

  };


  /*
  =====================================================
  COLLAPSED SIDEBAR
  =====================================================
  */

  if (collapsed) {

    return (

      <div className="hidden lg:flex flex-col items-center w-[56px] h-screen
      bg-[#0d0f14] border-r border-white/[0.06] py-4 shrink-0">


        {/* Expand Sidebar */}

        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl
          text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]
          transition-colors duration-150 bg-transparent border-none
          cursor-pointer mb-2"

          onClick={() => setCollapsed(false)}

          title="Expand Sidebar"
        >
          <PanelRight size={18} />
        </button>


        {/* New Chat */}

        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl
          text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]
          transition-colors duration-150 bg-transparent border-none
          cursor-pointer mb-3"

          onClick={()=> dispatch(setSelectedConversation(null))}

          title="New Chat"
        >
          <Plus size={18} />
        </button>


        {/* Divider */}

        <div className="w-7 h-px bg-white/[0.06] mb-3" />


        {/* Conversations */}

        <div className="flex-1 w-full flex flex-col items-center
        gap-2 overflow-y-auto px-2">

          {conversations.map((conversation) => (

            <button
              key={conversation._id}

              onClick={() => {
                dispatch(setSelectedConversation(conversation));
              }}

              title={conversation.title || "New Conversation"}

              className={`flex items-center justify-center
              w-9 h-9 rounded-xl border-none cursor-pointer
              transition-all duration-150

              ${selectedConversation?._id === conversation._id
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "bg-transparent text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
                }`}
            >

              <MessageSquare size={16} />

            </button>

          ))}

        </div>


        {/* User Avatar */}

        <div className="mt-3 pt-3 border-t border-white/[0.06]
        w-full flex justify-center">

          {userData ? (

            <button
              title={userData?.name || "User"}

              className="w-9 h-9 rounded-xl overflow-hidden
              border-2 border-indigo-500/25
              bg-transparent cursor-pointer
              hover:border-indigo-500/50
              transition-all duration-150"
            >

              {userData?.avatar && !imageError ? (

                <img
                  src={userData.avatar}
                  alt="User"

                  className="w-full h-full object-cover"

                  onError={() => setImageError(true)}
                />

              ) : (

                <div className="w-full h-full flex items-center
                justify-center text-slate-500">

                  <User size={17} />

                </div>

              )}

            </button>

          ) : (

            <User
              size={18}
              className="text-slate-500"
            />

          )}

        </div>

      </div>

    );

  }


  /*
  =====================================================
  NORMAL / EXPANDED SIDEBAR
  =====================================================
  */

  return (

    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 h-screen
      bg-[#0d0f14] border-r border-white/[0.06]
      ${collapsed ? 'w-0 overflow-hidden' : 'w-[250px]'}`}
    >

      <div className="flex flex-col h-full">


        {/* Header */}

        <div className="flex items-center gap-2.5 px-4 py-4
        border-b border-white/[0.06]">


          <div
            className="hidden lg:flex items-center justify-center
            w-7 h-7 rounded-lg text-slate-500
            hover:text-slate-200 hover:bg-white/[0.05]
            transition-colors duration-150 bg-transparent
            border-none cursor-pointer"

            onClick={() => setCollapsed(true)}
          >

            <PanelLeftIcon size={18} />

          </div>


          <span
            className="text-[16px] font-semibold text-slate-100
            tracking-tight flex-1"
          >
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
            className="flex items-center justify-center w-7 h-7
            rounded-lg text-slate-500 hover:text-slate-200
            hover:bg-white/[0.05] transition-colors duration-150
            bg-transparent border-none cursor-pointer"
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

            onClick={()=> dispatch(setSelectedConversation(null))}
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
                    onClick={() => {
                      dispatch(setSelectedConversation(conversation));
                    }}
                    className={`px-3 py-2.5 rounded-lg
                    text-sm cursor-pointer transition-colors
                        ${selectedConversation?._id === conversation._id
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "text-slate-300 hover:bg-white/[0.05] hover:text-slate-100"
                      }`}
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


        {/* User Section */}

        <div className="mx-2.5 h-px bg-white/[0.06]" />

        <div className="px-3.5 py-3.5">

          {userData ? (

            <div
              className="flex items-center gap-2.5 cursor-pointer
              rounded-xl px-3 py-2.5
              hover:bg-white/[0.05]
              transition-colors duration-150"
            >

              {/* Avatar */}

              <div className="relative shrink-0">

                {userData?.avatar && !imageError ? (

                  <img
                    className="w-9 h-9 rounded-xl object-cover
                    border-2 border-indigo-500/25"

                    src={userData.avatar}

                    alt="User"

                    onError={() => setImageError(true)}
                  />

                ) : (

                  <div
                    className="w-9 h-9 rounded-xl
                    border-2 border-indigo-500/25
                    flex items-center justify-center
                    text-slate-500"
                  >

                    <User size={17} />

                  </div>

                )}

              </div>


              {/* User Info */}

              <div className="flex-1 min-w-0">

                <p
                  className="text-[13.5px] font-semibold
                  text-slate-100 truncate"
                >
                  {userData?.name || "user"}
                </p>

                <p className="text-[11px] text-slate-600 mt-px">
                  Free Plan
                </p>

              </div>


              {/* Buttons */}

              <div className="flex gap-1">

                <button
                  className="flex items-center justify-center
                  w-7 h-7 rounded-[7px] border-none
                  bg-transparent text-yellow-600 cursor-pointer
                  hover:bg-white/10 hover:text-slate-400
                  transition-all duration-150"
                >

                  <Coins size={16} />

                </button>


                <button
                  className="flex items-center justify-center
                  w-7 h-7 rounded-[7px] border-none
                  bg-transparent text-slate-600 cursor-pointer
                  hover:bg-white/10 hover:text-slate-400
                  transition-all duration-150"

                  onClick={() => {

                    logOut();

                    dispatch(setUserdata(null));

                  }}
                >

                  <LogOut size={16} />

                </button>

              </div>

            </div>

          ) : (

            <button>
              Login
            </button>

          )}

        </div>

      </div>

    </div>

  );

}


export default SideBar;