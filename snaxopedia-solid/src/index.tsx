/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { StoreProvider } from './stores/store';

render(() => <StoreProvider><App /></StoreProvider>, document.getElementById('app') as HTMLElement);
