import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigator/AppNavigator';
import {useAppSelector} from './src/redux/index';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ActivityIndicator} from 'react-native';
import Toast from 'react-native-toast-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Host, Portal} from 'react-native-portalize';
const RootApp = () => {
  const isLoading = useAppSelector(state => state.app.loading);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
        <Toast />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3D4ED9" />
          </View>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <GestureHandlerRootView style={{flex: 1}}>
        <Host>
          <Provider store={store}>
            <RootApp />
          </Provider>
        </Host>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default App;
