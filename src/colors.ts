export const colorCodes = {
  // Reset
  '0m': '/',
  // Styles
  '1m': 'bold',
  '2m': 'dim',
  '3m': 'italic',
  '4m': 'underline',
  '22m': '/bold',
  '23m': '/italic',
  '24m': '/underline',
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
  '90m': 'dim',
  // Background colors
  '40m': 'bg:black',
  '41m': 'bg:red',
  '42m': 'bg:green',
  '43m': 'bg:yellow',
  '44m': 'bg:blue',
  '45m': 'bg:magenta',
  '46m': 'bg:cyan',
  '47m': 'bg:white',
  '49m': '/bg'
} as const;
