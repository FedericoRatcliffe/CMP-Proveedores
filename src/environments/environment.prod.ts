var pjson = require('../../package.json');

export const environment = {

  version: pjson.version,
  production: true,
  env: 'Prod',
  app: 'proveedores',
  apiBase: 'https://apicmp.cooperacionseguros.com.ar/wsproveedores',
  featuresApiBase: '',
  loginBase: 'https://apicmp.cooperacionseguros.com.ar',
  tokenBase: 'https://apicmp.cooperacionseguros.com.ar/token',
  apiCore: 'https://apicmp.cooperacionseguros.com.ar/wscore',
  adfs: {
    url: 'https://apicmp.cooperacionseguros.com.ar/proveedores',
    bypass: 'https://apicmp.cooperacionseguros.com.ar/proveedores'
  },
  SingleSignOn: true,
  apm: {
    env: 'Production', //Development, Testing, Staging, Production
    origin: ['https://apicmp.cooperacionseguros.com.ar']
  },
  elastic: 'https://cmp-elastic.apm.us-east-1.aws.found.io'
};
