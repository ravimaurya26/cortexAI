import api from "../../utils/axios";
export const createConversation = async () => {
    try {
        const {data} = await api.get("/api/chat/create-conversation");
        return data;
    }
    catch (error) {
        console.error("Error creating conversation:", error)
        return null;
    }
}