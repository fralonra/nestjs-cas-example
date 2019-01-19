const appPort = 3434;
const casHost = '127.0.0.1';
const casPort = 8989;

export default {
  baseUrl: `http://localhost:${appPort}`,
  appServer: {
    port: appPort,
    session: {
      secret: 'a secret',
    },
  },
  casServer: {
    port: casPort,
    ticket: 'afaketicket',
  },
  cas: {
    protocol: 'http',
    host: `${casHost}:${casPort}`,
    paths: {
      serviceValidate: 'p3/serviceValidate',
      login: 'login',
      logout: 'logout',
    }
  }
};
