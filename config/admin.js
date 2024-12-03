module.exports = ({ env }) => ({
  auth: {
    secret: env('4GL4CMsvX9vUNfNtS9HDQg=='),
  },
  apiToken: {
    salt: env('jiwnE1YVzuyAbFwaH5KT6A=='),
  },
  transfer: {
    token: {
      salt: env('5DMzr2sqSBE09lhm3DXyzg=='),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
