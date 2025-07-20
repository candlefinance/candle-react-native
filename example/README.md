# Candle React Native Example

This is an example application for Candle React Native, showcasing how to use the Candle SDK in a React Native environment.

## Getting Started

Add `.env` file in the root of the project `example` dir with the following content:

```env
EXPO_PUBLIC_CANDLE_APP_KEY=your_api_key_here
EXPO_PUBLIC_CANDLE_APP_SECRET=your_api_secret_here
```

To get started with the example application, follow these steps:

1. install the dependencies:
   ```bash
   bun install # run at root of the project
   ```
2. Start the application:

   ```bash
   bun run prebuild --clean # run in example directory
   bun run ios # or bun run android
   # alternatively, you can run the app directly on iOS or Android:
   bun run start
   xed ./ios
   ```

3. Submit to TestFlight using EAS
   ```bash
   # if first time, run: eas login # sign in using your Expo account in shared password manager and pick candle-finance org as also configured in app.json owner. There are 3 lanes in `eas.json`:
   eas build --platform ios --profile production --submit
   ```

## Development

Update the `package/src` and then run `bun run specs` to regenerate the native code. Open the Xcode project and edit the development pod (example: `RNCandle.swift`)
