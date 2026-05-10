export type UserSafeError = {
  title: string
  message: string
}

const extractMessage = (value: unknown): string | undefined => {
  if (value === null || value === undefined) {
    return undefined
  }
  if (typeof value === 'string') {
    return value
  }
  if (value instanceof Error) {
    return value.message
  }
  if (typeof value === 'object' && 'message' in value) {
    const unknownMessage = value.message
    return typeof unknownMessage === 'string' ? unknownMessage : undefined
  }
  return undefined
}

const matches = (raw: string, pattern: string): boolean =>
  raw.toLowerCase().includes(pattern.toLowerCase())

export function toUserSafeError(error: unknown): UserSafeError {
  const raw = extractMessage(error)
  if (raw === undefined || raw.length === 0) {
    return {
      title: 'Request Failed',
      message: 'Something went wrong. Please try again.',
    }
  }

  const serverMessage = /message:\s*"([^"]+)"/u.exec(raw)?.[1]
  if (matches(raw, 'noActiveUser')) {
    return {
      title: 'No Active User',
      message: 'Go through onboarding again.',
    }
  }
  if (matches(raw, 'existingActiveUser')) {
    return {
      title: 'Existing Active User',
      message: 'Delete user first.',
    }
  }
  if (matches(raw, 'createSessionError')) {
    return {
      title: 'Create Session Error',
      message: 'Contact Candle support.',
    }
  }
  if (matches(raw, 'keychainError')) {
    return {
      title: 'Keychain Error',
      message: 'Double-check your access group.',
    }
  }
  if (matches(raw, 'sessionError')) {
    return {
      title: 'Session Error',
      message: 'Check your internet connection.',
    }
  }
  if (matches(raw, 'networkError')) {
    return {
      title: 'Network Error',
      message: serverMessage ?? raw,
    }
  }
  if (matches(raw, 'notFound_app')) {
    return {
      title: 'App Not Found',
      message: serverMessage ?? 'The app could not be found.',
    }
  }
  if (matches(raw, 'notFound_user')) {
    return {
      title: 'User Not Found',
      message: serverMessage ?? 'The user could not be found.',
    }
  }
  if (matches(raw, 'notFound_linkedAccount')) {
    return {
      title: 'Linked Account Not Found',
      message: serverMessage ?? 'The linked account could not be found.',
    }
  }
  if (matches(raw, 'notFound_assetAccount')) {
    return {
      title: 'Asset Account Not Found',
      message: serverMessage ?? 'The asset account could not be found.',
    }
  }
  if (matches(raw, 'notFound_trade')) {
    return {
      title: 'Trade Not Found',
      message: serverMessage ?? 'The trade could not be found.',
    }
  }
  if (matches(raw, 'schemaInvalid_request')) {
    return {
      title: 'Request Schema Invalid',
      message: serverMessage ?? 'One or more request fields are invalid.',
    }
  }
  if (matches(raw, 'badAuthorization_user')) {
    return {
      title: 'Bad User Authorization',
      message: serverMessage ?? 'Authorization failed for this user.',
    }
  }
  if (matches(raw, 'badAuthorization_linkedAccount')) {
    return {
      title: 'Bad Linked Account Authorization',
      message: serverMessage ?? 'Authorization failed for this linked account.',
    }
  }
  if (matches(raw, 'badAuthorization_app')) {
    return {
      title: 'Bad App Authorization',
      message: serverMessage ?? 'Authorization failed for this app.',
    }
  }
  if (matches(raw, 'alreadyUnlinked_linkedAccount')) {
    return {
      title: 'Linked Account Already Unlinked',
      message: serverMessage ?? 'This linked account has already been unlinked.',
    }
  }
  if (matches(raw, 'disabledPendingPayment_app')) {
    return {
      title: 'App Disabled Pending Payment',
      message: serverMessage ?? 'This app is disabled pending payment.',
    }
  }
  if (matches(raw, 'overUserLimit_app')) {
    return {
      title: 'App Over User Limit',
      message: serverMessage ?? 'This app is over its user limit.',
    }
  }
  if (matches(raw, 'unavailable_proxy')) {
    return {
      title: 'Proxy Unavailable',
      message: serverMessage ?? 'The upstream service is currently unavailable.',
    }
  }
  if (matches(raw, 'unexpectedStatusCode')) {
    return {
      title: 'Unexpected Status Code',
      message: serverMessage ?? 'Received an unexpected server response.',
    }
  }
  if (matches(raw, 'internalServerError') || matches(raw, 'unexpected')) {
    return {
      title: 'Internal Server Error',
      message: serverMessage ?? 'Try again in a moment.',
    }
  }

  return {
    title: 'Request Failed',
    message: serverMessage ?? 'Something went wrong. Please try again.',
  }
}
