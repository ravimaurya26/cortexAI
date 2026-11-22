import proxy from "express-http-proxy";

export const proxyWithHeaders = (serviceUrl) => {
    return proxy(serviceUrl, {

        // Forward the correct path to the microservice
        proxyReqPathResolver: (req) => {
            console.log("Original URL:", req.originalUrl);
            console.log("Forwarding URL:", req.url);

            return req.url;
        },

        // Forward authenticated user information
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            console.log("USER OBJECT:", srcReq.user);

            if (srcReq.user?.userId) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
            }

            return proxyReqOpts;
        }
    });
};