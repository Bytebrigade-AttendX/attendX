import "dotenv/config"
export default({config})=>({
  ...config,
  extra:{
    apiUrl:process.env.API_BASE_URL,
    router:{},
    "eas": {
        "projectId": "e9a1904a-59c2-41b7-b859-96563794f1d0"
      },
  }
})