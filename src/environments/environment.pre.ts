var pjson = require('../../package.json');

export const environment = {
  version: pjson.version,
  production: false,
  env: 'Pre',
  app: 'proveedores',
  apiBase: 'https://apicmppre.cooperacionseguros.com.ar/wsproveedores',
  featuresApiBase: '',
  loginBase: 'https://apicmppre.cooperacionseguros.com.ar',
  adfs: {
    url: 'https://apicmppre.cooperacionseguros.com.ar/wsproveedores',
    bypass: 'https://apicmppre.cooperacionseguros.com.ar/proveedores'
  },
  SingleSignOn: true,

  apm: {
    env: 'Staging', //Development, Testing, Staging, Production
    origin: ['https://apicmppre.cooperacionseguros.com.ar']
  },
  apm_env: 'Staging',
  elastic: 'https://cmp-elastic.apm.us-east-1.aws.found.io'
};
