import React, {useMemo} from 'react';
import {StackNavigator} from './navigation';
import {StyleSheet} from 'react-native';
import {useAppRoutes} from './useAppRoutes';
import {ContactRepository} from './data';
import {AppRouteParams, APP_INITIAL_STATE} from './AppRoutes';
import {ThemeProvider, lightAppTheme} from './theme';

const App = () => {
  const contactRepository = useMemo(() => new ContactRepository(), []);
  const appRoutes = useAppRoutes({contactRepository});

  return (
    <ThemeProvider value={lightAppTheme}>
      <StackNavigator<AppRouteParams>
        style={StyleSheet.absoluteFill}
        initialState={APP_INITIAL_STATE}
        routes={appRoutes}
      />
    </ThemeProvider>
  );
};

export default App;
