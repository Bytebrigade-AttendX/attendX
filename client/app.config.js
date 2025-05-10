import "dotenv/config";

export default ({ config }) => ({
  ...config,
  extra: {
    apiUrl:
      "https://3254-2405-201-a43a-1097-1dea-cef0-5d14-57a6.ngrok-free.app",
    router: {},
    eas: {
      projectId: "28275773-5de9-45d3-b9f5-8aa5fce8f70e",
    },
  },
});
