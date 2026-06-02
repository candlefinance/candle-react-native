export const hostedRedirectUri = 'candle-rn://oauth/callback'

export const isHostedAuthCallbackURL = (url: string) => url.startsWith(hostedRedirectUri)
