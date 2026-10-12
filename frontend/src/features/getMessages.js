import React from 'react'
import api from '../../utils/axios';

async function getMessages(id) {
    try{
        const {data} = await api.get(`/api/chat/getMessage/${id}`);
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
}

export default getMessages
