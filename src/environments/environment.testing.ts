var pjson = require('../../package.json');

export const environment = {

  version: pjson.version,
  production: false,
  env: 'Test',
  app: 'proveedores',
  apiBase: 'https://apicmptest.cooperacionseguros.com.ar/wsproveedores',
  featuresApiBase: '',
  loginBase: 'https://apicmptest.cooperacionseguros.com.ar',
  adfs: {
    url: 'https://apicmptest.cooperacionseguros.com.ar/proveedores',
    bypass: 'https://apicmptest.cooperacionseguros.com.ar/proveedores'
  },
  SingleSignOn: true,
  apm: {
    env: 'Testing', //Development, Testing, Staging, Production
    origin: ['https://apicmptest.cooperacionseguros.com.ar']
  },
  elastic: 'https://cmp-elastic.apm.us-east-1.aws.found.io'
};
