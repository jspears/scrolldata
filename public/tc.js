import theme, { themeClass } from '../src/themes/index';
import AppStyle from './App.stylm';

theme({ App: AppStyle });

const tc = themeClass({ displayName: 'App' });
export default tc;
