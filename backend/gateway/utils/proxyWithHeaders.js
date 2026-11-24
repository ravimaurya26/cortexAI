import proxy from "express-http-proxy";

export const proxyWithHeaders = (serviceUrl) => {
    return proxy(serviceUrl, {

        proxyReqPathResolver: (req) => {
            console.log("Original URL:", req.originalUrl);
            console.log("Forwarding URL:", req.url);

            return req.url;
        },

        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            console.log("USER OBJECT:", srcReq.user);

            if (srcReq.user?.userId) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
            }

            return proxyReqOpts;
        }
    });
};