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
      ],
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#20A7B8",
          "image": "./assets/splash-icon.png",
          "dark": {
            "image": "./assets/splash-icon.png",
            "backgroundColor": "#20A7B8"
          },
          "imageWidth": 100
        }
      ]
    ],
    "name": "StudantAI",
    "slug": "StudantAI",
    "version": "1.2.5",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#20A7B8"
    },
    "web": {
      "bundler": "metro"
    },
    "android": {
      "package": "com.weslenpy.studantai",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#20A7B8"
      },
      "permissions": [
        "android.permission.INTERNET"
      ]
    },
    "extra": {
      "GEMINI_API_KEY": process.env.GEMINI_API_KEY,
    },
  }
}
