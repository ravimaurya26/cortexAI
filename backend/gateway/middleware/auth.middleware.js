import redis from "../../shared/redis/redis.js";

const protect = async(req, res, next) =>{
    try {
        const sessionId = req.cookies?.session;
        if (!sessionId) {
            return res.status(400).json({ message: "Unauthorized: No session ID provided" });
        }
        const session = await redis.get(`session:${sessionId}`);
        if (!session) {
            return res.status(400).json({ message: "Sesssion expired" });
        }
        req.user = JSON.parse(session);
        next();

    }
    catch (error) {
        return res.status(500).json({ message: `Error in auth middleware: ${error}` });
    }
}

export default protect;