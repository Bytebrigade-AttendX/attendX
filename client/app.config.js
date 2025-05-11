import "dotenv/config"
export default({config})=>({
  ...config,
  extra:{
    apiUrl:process.env.API_BASE_URL,
    router:{},
    "eas": {
        "projectId": "da5b7df6-f3c8-483e-b787-e72f34dcc928"
      },
  }
})