import { createSlice } from '@reduxjs/toolkit';

const conversationSlice = createSlice({
name: 'conversation',

initialState: {
    conversations: [],
    selectedConversation: null
},

reducers: {
    setConversation: (state, action) => {
        state.conversations = action.payload;
    },

    addConversation: (state, action) => {
        state.conversations.unshift(action.payload);
    },

    setSelectedConversation: (state, action) => {
        state.selectedConversation = action.payload;
    },

    setConvTitle: (state, action) => {
        const { title, conversationID } = action.payload;

        state.conversations = state.conversations.map((conv) =>
            conv._id === conversationID
                ? { ...conv, title }
                : conv
        );

        if (state.selectedConversation?._id === conversationID) {
            state.selectedConversation = {
                ...state.selectedConversation,
                title
            };
        }
    }
}

});

export const {
setConversation,
addConversation,
setConvTitle,
setSelectedConversation
} = conversationSlice.actions;

export default conversationSlice.reducer;