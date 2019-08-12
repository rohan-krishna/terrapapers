/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.disableYellowBox = true;

export default function Main() {
    return (
        <PaperProvider>
            <App />
        </PaperProvider>
    )
}

// AppRegistry.registerComponent('terrapapers', () => Main);

AppRegistry.registerComponent(appName, () => App);
