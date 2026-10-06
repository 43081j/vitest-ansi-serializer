export const cursor = {
  '?25l': 'hide',
  '?25h': 'show',
  '7': 'save',
  '8': 'restore'
} as const;

export const repeatableCursor = {
  A: 'up',
  B: 'down',
  C: 'forward',
  D: 'backward',
  E: 'nextLine',
  F: 'prevLine',
  G: 'left',
  S: 'scrollUp',
  T: 'scrollDown'
} as const;

export const erase = {
  '2J': 'screen',
  J: 'down',
  '0J': 'down',
  '1J': 'up',
  K: 'lineEnd',
  '0K': 'lineEnd',
  '1K': 'lineStart',
  '2K': 'line',
  c: 'reset'
} as const;

export const color = {
  // Reset
  '0m': '/',
  // Modifiers
  '1m': 'bold',
  '2m': 'dim',
  '3m': 'italic',
  '4m': 'underline',
  '5m': 'blink',
  '7m': 'inverse',
  '8m': 'hidden',
  '9m': 'strikethrough',
  '21m': 'doubleunderline',
  '51m': 'framed',
  '53m': 'overlined',
  '22m': '/bold',
  '23m': '/italic',
  '24m': '/underline',
  '25m': '/blink',
  '27m': '/inverse',
  '28m': '/hidden',
  '29m': '/strikethrough',
  '54m': '/framed',
  '55m': '/overlined',
  // Foreground colors
  '30m': 'black',
  '31m': 'red',
  '32m': 'green',
  '33m': 'yellow',
  '34m': 'blue',
  '35m': 'magenta',
  '36m': 'cyan',
  '37m': 'white',
  '39m': '/fg',
  // Bright foreground colors
  '90m': 'grey',
  '91m': 'redBright',
  '92m': 'greenBright',
  '93m': 'yellowBright',
  '94m': 'blueBright',
  '95m': 'magentaBright',
  '96m': 'cyanBright',
  '97m': 'whiteBright',
  // Background colors
  '40m': 'bg:black',
  '41m': 'bg:red',
  '42m': 'bg:green',
  '43m': 'bg:yellow',
  '44m': 'bg:blue',
  '45m': 'bg:magenta',
  '46m': 'bg:cyan',
  '47m': 'bg:white',
  '49m': '/bg',
  // Bright background colors
  '100m': 'bg:grey',
  '101m': 'bg:redBright',
  '102m': 'bg:greenBright',
  '103m': 'bg:yellowBright',
  '104m': 'bg:blueBright',
  '105m': 'bg:magentaBright',
  '106m': 'bg:cyanBright',
  '107m': 'bg:whiteBright'
} as const;
