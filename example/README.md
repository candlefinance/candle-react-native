# Candle React Native Example

This app demonstrates the React Native Candle SDK:

- services linking and unlinking
- onboarding + user creation
- asset accounts with filters
- trades with filters and search
- trade quote request templates, quote retrieval, and trade execution

## Getting Started

Set environment variables:

```env
export EXPO_PUBLIC_CANDLE_CLIENT_ID=your_client_id_here
export GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Run:

```bash
pnpm install
cd examples
pnpm run start
```

For native iOS builds:

```bash
pnpm run ios
```

For native Android builds:

```bash
pnpm run android
```
