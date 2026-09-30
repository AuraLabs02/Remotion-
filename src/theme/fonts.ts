import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Variable fonts, bundled locally so renders never depend on the network.
const fonts = [
  {family: 'Roboto', file: 'Roboto-latin-var.woff2'},
  {family: 'Inter', file: 'Inter-latin-var.woff2'},
  {family: 'JetBrains Mono', file: 'JetBrainsMono-latin-var.woff2'},
];

export const fontsReady = Promise.all(
  fonts.map((f) =>
    loadFont({
      family: f.family,
      url: staticFile(`fonts/${f.file}`),
      weight: '100 900',
      format: 'woff2',
    }),
  ),
);
