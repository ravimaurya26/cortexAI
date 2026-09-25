import api from "../../utils/axios";
export const getConversations = async () => {
    try {
        const {data} = await api.get("/api/chat/conversations");
        return data;
    }
    catch (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }
}