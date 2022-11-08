export default () => ({
    "expo": {
        "name": "inTime",
        "slug": "in-time",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/icon.png",
        "userInterfaceStyle": "dark",
        "backgroundColor": "#1e293b",
        "splash": {
            "image": "./assets/splash.png",
            "resizeMode": "contain",
            "backgroundColor": "#1e293b"
        },
        "updates": {
            "fallbackToCacheTimeout": 0
        },
        "assetBundlePatterns": [
            "**/*"
        ],
        "ios": {
            "supportsTablet": true
        },
        "android": {
            "adaptiveIcon": {
                "foregroundImage": "./assets/adaptive-icon.png",
                "backgroundColor": "#006BA1"
            },
            "config": {
                "googleMaps": {
                    "apiKey": process.env.MAPS_KEY
                }
            },
            "package": "com.pwietmaier.intime",
            "permissions": ["ACCESS_BACKGROUND_LOCATION", "SCHEDULE_EXACT_ALARM"]
        },
        "web": {
            "favicon": "./assets/favicon.png"
        },
        "extra": {
            firebaseApiKey: process.env.FIREBASE_KEY
        }
    }
})