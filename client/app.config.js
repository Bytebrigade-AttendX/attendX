import "dotenv/config";
export default ({ config }) => ({
  ...config,
  extra: {
    router: {},
    eas: {
      projectId: "b1841607-eac3-4367-a9bf-5b4cad7ff9b7",
    },
    apiUrl: "https://attendance-backend-y70q.onrender.com",
  },
});
0;
