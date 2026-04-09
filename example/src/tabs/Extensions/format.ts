const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
})

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'full',
  timeStyle: 'full',
})

export function formatMoney(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`
  }
}

export function formatDateTime(isoDateTime: string): string {
  const parsed = new Date(isoDateTime)
  if (Number.isNaN(parsed.valueOf())) {
    return isoDateTime
  }
  return dateTimeFormatter.format(parsed)
}

export function formatDate(date: Date): string {
  return dateFormatter.format(date)
}
