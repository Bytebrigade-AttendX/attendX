import "dotenv/config";
export default ({ config }) => ({
  ...config,
  extra: {
    router: {},
    eas: {
      projectId: "b1841607-eac3-4367-a9bf-5b4cad7ff9b7",
    },
    apiUrl: "https://attendance-backend-fcu1.onrender.com",
  },
});
0;
