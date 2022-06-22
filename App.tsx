import 'reflect-metadata';
import React from 'react';
//import ExamplesHome from './src/modules/examples/ExamplesHome';
import TransactionEntryLanding from './src/modules/transaction-entries/TransactionEntryLanding';
import { Icon, Text } from '@rneui/base';
import useCachedResources from './src/global/hooks/useCachedResources';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const App: React.FC = () => {

  //Using useCachedResources for dataSource loading, while splash screen is on.
  const { isLoadingComplete, dataSource } = useCachedResources();

  const Tab = createBottomTabNavigator();

  //Create the tab navigator props
  //below are some optional props that can be passed to Tab.Navigator. You can try the code with and without options
  const tabProps = {
    initialRouteName: 'TransactionEntryLandingScreen',
    tabBarOptions: {
      activeTintColor: 'green',
      inactiveTintColor: 'grey',
      style: {
        backgroundColor: '#eee',
      },
      backBehavior: 'history'//Behaviour when system back is touched. Options are none, initialRoute, order, history. This seems to be buggy
    },
    lazy: true //default is true
  }

  const TabNavigator = () =>
  (
    <Tab.Navigator {...tabProps}>
      <Tab.Screen
        name="TransactionEntryLandingScreen"
        children={() => <TransactionEntryLanding dataSource={dataSource!}/>}
        //component={TransactionEntryLanding}
        options={{
          title: 'Transaction Manager',
          tabBarActiveBackgroundColor: 'transparent',
          tabBarActiveTintColor: 'darkblue',
          headerShown: false,
          tabBarLabel: 'Transaction',
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="receipt-long"
              color={color}
              size={size}
            />
          )
        }}
      />
      <Tab.Screen
        name="AssetEntryLandingScreen"
        children={() =>
        (
          <View style={{flex: 1, justifyContent:'center', alignItems:'center', backgroundColor: 'lightgreen'}}>
            <Text>You can replace this with Asset Entry landing page</Text>
          </View>
        )}
        options={{
          title: "Asset Manager",
          headerShown: false,
          tabBarLabel: 'Asset',
          tabBarActiveTintColor: 'darkgreen',
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="inventory"
              color={color}
              size={size}
            />
          )
        }}
      />
    </Tab.Navigator>
  )


  //Prepare our conditional display. What we display will depend on whether dataSource is available or not
  const Display = () => {
    if (dataSource) {
      return (

        <NavigationContainer>
          {/*<TransactionEntryLanding dataSource={dataSource} />*/}
          {/*<ExamplesHome dataSource={dataSource} />*/}
          <TabNavigator />
        </NavigationContainer>
      )
    } else {
      return (
        <Text>
          Cannot get data source
        </Text>
      )
    }
  }

  //Check if loading is complete before returning a view
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <>
        <Display />
        {/* Below is just a footer message */}
        {/*<Text style={{ padding: 6, fontSize: 14, fontStyle: "italic", textAlign: 'center' }}>Copyright: Pius Onobhayedo</Text>*/}
      </>
    );
  }
}

export default App;