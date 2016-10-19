require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'Swiss React Community',
    description: 'Die erste Schweizer React Community',
    subdescription: 'React.js, Flux/Redux, React Native',
    head: {
      titleTemplate: 'Swiss React Community: %s',
      meta: [
        {name: 'description', content: 'Die erste Schweizer React Community!'},
        {name: 'google-site-verification', content: 'n548XvPx40jKyDlkuYaz8t42CLWs5zfNFGexF1Deyl8'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'Die erste Schweizer React Community!'},
        {property: 'og:image', content: 'http://swiss-react.ch/logo.png'},
        {property: 'og:locale', content: 'de_DE'},
        {property: 'og:title', content: 'Swiss React Community'},
        {property: 'og:description', content: 'Die erste Schweizer React Community!'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@eaj'},
        {property: 'og:creator', content: '@eaj'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    },
    settings: {
      SenderEmail: 'info%40emmaandjohn.ch',
      SenderEmailPw: '1.emma.and.john.1',
      SenderEmailSMTPHost: 'asmtp.mail.hostpoint.ch'
    }
  },

}, environment);
