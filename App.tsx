/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppProvider from './src/context/app';

import {DetailScreen, ResultsScreen, SearchScreen} from './src/screens';

export type AppStackParamList = {
  Search: undefined;
  Results: undefined;
  Detail: {id: number};
};

const AppStack = createNativeStackNavigator<AppStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <AppStack.Navigator screenOptions={{headerShown: false}}>
            <AppStack.Screen name="Search" component={SearchScreen} />
            <AppStack.Screen name="Results" component={ResultsScreen} />
            <AppStack.Screen name="Detail" component={DetailScreen} />
          </AppStack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
};

export default App;
