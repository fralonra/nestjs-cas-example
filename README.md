# nestjs-cas-example

An example of using [nestjs](https://github.com/nestjs/nest) to connect CAS ([Central Authentication Service](https://en.wikipedia.org/wiki/Central_Authentication_Service)). Using [connect-cas](https://github.com/AceMetrix/connect-cas) underlying.

## Running the example

* Clone: `git clone https://github.com/fralonra/nestjs-cas-example`
* Install: `cd nestjs-cas-example && yarn`
* If you wish to use the existing fake CAS server, please run `yarn prestart:prod && yarn cas:prod`. Or you can specify your CAS server settings in `config/default.ts`.
```javascript
// config/default.ts
const casHost = '127.0.0.1';
const casPort = 8989;

export default {
  // ...
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

```
* Run the CAS client: `yarn app:dev`, and now you can open `http://localhost:3434` (by default) to see the example.

