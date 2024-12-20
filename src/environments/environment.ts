var pjson = require('../../package.json');

export const environment = {
  version: pjson.version,
  production: false,
  app: 'proveedores',
  env: 'Development',

  clientId: 'PORTALPROVEEDORES',
  clientSecret: '3EFEE37E-4698-4657-A12F-EB9065A8F5A5',
  
  apiBase: 'https://apicmptest.cooperacionseguros.com.ar/wsproveedores',
  tokenBase: 'https://apicmptest.cooperacionseguros.com.ar/token',
  
  apiCore: 'https://apicmptest.cooperacionseguros.com.ar/wscore',
  
  featuresApiBase: '',
  loginBase: 'https://apicmptest.cooperacionseguros.com.ar',
  adfs: {
    url: 'https://apicmptest.cooperacionseguros.com.ar/proveedores',
    bypass: 'https://apicmptest.cooperacionseguros.com.ar/proveedores'
  },
  SingleSignOn: true,
  apm: {
    env: 'Development', //Development, Testing, Staging, Production
    origin: ['https://apicmptest.cooperacionseguros.com.ar']
  },
  elastic: 'https://cmp-elastic.apm.us-east-1.aws.found.io'
};