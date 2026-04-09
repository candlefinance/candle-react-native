export type LogoTone = 'crimson' | 'gray' | 'teal' | 'green' | 'red'

export type Logo =
  | {
      kind: 'uri'
      uri: string
    }
  | {
      kind: 'text'
      text: string
      tone: LogoTone
    }
  | {
      kind: 'symbol'
      symbol: 'ellipsis-horizontal' | 'gift' | 'image'
      tone: LogoTone
    }
