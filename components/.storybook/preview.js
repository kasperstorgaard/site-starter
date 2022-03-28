import '../src/styles/reset.css';
import '../src/styles/props.scss';
import '../src/styles/brand.scss';
import './preview-fonts.css';
import './preview.scss';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
