export type BadgeTone =
  | 'black'
  | 'blue'
  | 'brown'
  | 'crimson'
  | 'cyan'
  | 'gray'
  | 'green'
  | 'maroon'
  | 'orange'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow'

export type BadgeChip = {
  id: string
  text: string
  tone: BadgeTone
}
