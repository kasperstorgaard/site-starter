import '../src/styles/reset.css';
import '../src/styles/props.scss';
import '../src/styles/brand.scss';
import '../src/styles/fonts.css';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'fullscreen',
}
