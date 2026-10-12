import redis from "../../../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";

export const getMemory = async (conversationId) => {
    const key = `messages-${conversationId}`;

    // 1. Check Redis cache first
    const cached = await redis.get(key);

    if (cached) {
        try {
            const parsed = JSON.parse(cached);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (error) {
            console.error("Redis memory parsing error:", error.message);
        }
    }

    // 2. If Redis has no valid history, fetch it from the database
    const messages = await getMessages(conversationId);

    // 3. Always ensure history is an array
    const safeMessages = Array.isArray(messages) ? messages : [];

    // 4. Cache the history for 24 hours
    await redis.set(
        key,
        JSON.stringify(safeMessages),
        "EX",
        24 * 60 * 60
    );

    return safeMessages;
};

export const addMessage = async (conversationId, role, content) => {
    const key = `messages-${conversationId}`;

    const rawMessages = await redis.get(key);

    let messages = [];

    if (rawMessages) {
        try {
            const parsed = JSON.parse(rawMessages);
            messages = Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Redis memory parsing error:", error.message);
        }
    }

    // Add the new message
    messages.push({
        role,
        content
    });

    // Keep only the latest 20 messages
    if (messages.length > 20) {
        messages = messages.slice(-20);
    }

    // Save to Redis for 24 hours
    await redis.set(
        key,
        JSON.stringify(messages),
        "EX",
        24 * 60 * 60
    );
};