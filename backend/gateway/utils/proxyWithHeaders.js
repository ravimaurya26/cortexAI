import proxy from "express-http-proxy";

export const proxyWithHeaders = (serviceUrl) => {
  return proxy(serviceUrl, {
    proxyReqPathResolver: (req) => {
      console.log("Forwarding:", req.method, req.originalUrl);

      return req.originalUrl;
    },

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      console.log("USER OBJECT:", srcReq.user);

      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }

      return proxyReqOpts;
    },
  });
};