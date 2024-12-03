const path = require('path');

module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        root: env('UPLOADS_ROOT', path.join(__dirname, '../public/uploads')),
      },
    },
  },
});
