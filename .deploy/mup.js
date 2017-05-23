const settings = require('./settings.json');

module.exports = {
  servers: {
    one: {
      host: settings.private.mupHost,
      username: settings.private.mupUsername,
      pem: settings.private.mupPem,
    },
  },
  meteor: {
    name: 'shiftstats',
    path: settings.private.mupPath,
    servers: {
      one: {},
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'https://shiftstats.info',
      MONGO_URL: 'mongodb://localhost/meteor',
    },
    docker: {
      image: 'abernix/meteord:base',
      imageFrontendServer: 'meteorhacks/mup-frontend-server',
    },
    deployCheckWaitTime: 120,
    enableUploadProgressBar: true,
    ssl: {
      autogenerate: {
        email: 'hoffmann.mathias@gmail.com',
        domains: 'shiftstats.info,www.shiftstats.info',
      },
    },
  },
  mongo: {
    port: 27017,
    version: '3.4.1',
    servers: {
      one: {},
    },
  },
};
