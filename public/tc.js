import theme, { themeClass } from '../src/themes/index';
import AppStyle from './App.stylm';
import App from './App';

theme({ App: AppStyle });

const tc = themeClass(App);
export default tc;
