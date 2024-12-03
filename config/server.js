const { config } = require('process');

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['rwSPVKNi9c/SaJfsBs5y/Q==', '3tj699Un1YmQDF5SkwY5Vg==', 'xg6OuzXxxbeX7RrHDlTZTg==', 'mLbSK8TNVgE2p5PBLgwNPw==']), 
  },
});


 
