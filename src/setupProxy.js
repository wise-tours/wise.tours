
const PrismaProxy = require("@prisma-cms/front/lib/setupProxy");

// var proxy = require('http-proxy-middleware');


// module.exports = function (app) {

//   // app.use(proxy('/images/', {
//   //   target: 'http://localhost:4000/',
//   //   pathRewrite: {
//   //     // "^/images/resized/([^/]+)/uploads/(.+)": "/images/$1/$2",
//   //     "^/images/resized/(.+?)/(.+)": "/images/$1/$2",
//   //     // "^/images/([^/]+)/uploads/(.+)": "/images/$1/$2"
//   //   }
//   // }));

//   PrismaProxy(app);

// };

module.exports = PrismaProxy;