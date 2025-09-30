import 'dotenv/config';

export default {
  "expo": {
    "userInterfaceStyle": "automatic",
    "scheme": "acme",
    "plugins": [
      "expo-router",
      [
        "expo-document-picker",
        {
          "iCloudContainerEnvironment": "Production"
        }
      ]
    ],
    "name": "StudantAI",
    "slug": "StudantAI",
    "web": {
      "bundler": "metro"
    },
    "android": {
      "package": "com.weslenpy.studantai"
    },
    "extra": {
      "GEMINI_API_KEY": process.env.GEMINI_API_KEY,
    },
  }
}
