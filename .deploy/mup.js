module.exports = {
  servers: {
    one: {
      host: Meteor.settings.private.mupHost,
      username: Meteor.settings.private.mupUsername,
      pem: '~/.ssh/id_rsa',
    },
  },
  meteor: {
    name: 'shiftstats',
    path: '/home/mathias/dev-web/shiftstats',
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
