import React from 'react';
import {Provider} from 'react-redux';

import {store} from './src/store/index';
import Navigation from './src/navigation/index';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import './src/constants/IMLocalize';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
