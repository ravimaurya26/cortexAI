import { createSlice } from '@reduxjs/toolkit'
const conversationSlice = createSlice({
    name: 'conversation',   
    initialState: {
        conversations:[],
    },
    reducers: {
        setConversation:(state,action)=>{
            state.conversations=action.payload
        },
        addConversation:(state,action)=>{
            state.conversations.unshift(action.payload)
        }


    }
})

export const { setConversation,addConversation } = conversationSlice.actions;
export default conversationSlice.reducer;