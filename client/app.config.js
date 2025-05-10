import "dotenv/config";

export default ({ config }) => ({
  ...config,
  extra: {
    apiUrl: process.env.API_BASE_URL,
    someKey: process.env.SOME_KEY,
  },
});
