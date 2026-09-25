import Conversation from "../Models/conversation.model.js";
import Message from "../Models/message.model.js";
export const createConversation = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        console.log("UserId:", userId)
        const conversation = await Conversation.create({ 
            userId : userId,

         });
        return res.status(200).json(conversation);
    }
    catch (error) {
        return res.status(500).json({ message: `Error creating conversation: ${error}` });
    }   
}

export const getConversations = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        console.log("UserId:", userId)
        const conversation = await Conversation.find({ 
            userId : userId,

         }).sort({ updatedAt: -1 });

        
        return res.status(200).json(conversation);
    }
    catch (error) {
        return res.status(500).json({ message: `Error fetching conversation: ${error}` });
    }   
}

export const updateConversation = async (req, res) => {
    try {
        const {id, title} = req.body;
        const conversation = await Conversation.findByIdAndUpdate(id, { title }
            
         );

        
        return res.status(200).json(conversation);
    }
    catch (error) {
        return res.status(500).json({ message: `Error updating conversation: ${error}` });
    }   
}


export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content } = req.body;
        const message = await Message.create({ conversationId, role, content 

        })
        return res.status(200).json(message); 
    }
    catch (error) {
        return res.status(500).json({ message: `Error saving message: ${error}` });
    }
}

export const getMessage = async (req, res) => {
    try {
        const message = await Message.find({ 
            conversationId: req.params.conversationId, 
            }).sort({ createdAt: -1 });
        return res.status(200).json(message); 
    }
    catch (error) {
    console.error("CREATE CONVERSATION ERROR:", error);

    return res.status(500).json({
        message: `Error creating conversation: ${error.message}`
    });  }
}

