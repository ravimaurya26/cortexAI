
import proxy from "express-http-proxy";

export const proxyWithHeaders = (serviceUrl) => {
    return proxy(serviceUrl, {
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {

            if (srcReq.userId) {
                proxyReqOpts.headers["x-user-id"] = srcReq.userId;
            }

            return proxyReqOpts;
        }
    });
};
