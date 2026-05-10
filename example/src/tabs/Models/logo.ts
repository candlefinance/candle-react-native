export type LogoTone = 'blue' | 'crimson' | 'gray' | 'teal' | 'green' | 'red'

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
      symbol: 'chatbubble-ellipses' | 'ellipsis-horizontal' | 'gift' | 'image'
      tone: LogoTone
    }
