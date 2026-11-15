import axios from "axios";

export const getMessages = async (conversationId) => {
    try {
        const { data } = await axios.get(
            `${process.env.CHAT_SERVICE_URL}/api/chat/getMessage/${conversationId}`
        );

        return data;
    } catch (error) {
        console.error(
            "Error fetching messages:",
            error.response?.data || error.message
        );
        return null;
    }
};