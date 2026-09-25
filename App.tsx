import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { enableScreens } from 'react-native-screens';

import { StoreProvider } from './lib/store';
import HomeScreen from './screens/HomeScreen';
import SentencesScreen from './screens/SentencesScreen';
import TemplatesScreen from './screens/TemplatesScreen';
import TemplateDetailScreen from './screens/TemplateDetailScreen';
import QuizScreen from './screens/QuizScreen';
import SavedScreen from './screens/SavedScreen';

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TemplateStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MektupListe" component={TemplatesScreen} />
      <Stack.Screen name="MektupDetay" component={TemplateDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });
  if (!fontsLoaded) return null;

  return (
    <StoreProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#B45309',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#F1E8D5',
              paddingBottom: 8,
              paddingTop: 8,
              height: 66,
            },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
            tabBarIcon: ({ color, size, focused }) => {
              const icons: Record<string, string> = {
                Anasayfa: focused ? 'home' : 'home-outline',
                Cümleler: focused ? 'chatbubbles' : 'chatbubbles-outline',
                Mektuplar: focused ? 'mail' : 'mail-outline',
                Test: focused ? 'trophy' : 'trophy-outline',
                Defterim: focused ? 'bookmark' : 'bookmark-outline',
              };
              return <Ionicons name={(icons[route.name] ?? 'ellipse') as any} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Anasayfa" component={HomeScreen} />
          <Tab.Screen name="Cümleler" component={SentencesScreen} />
          <Tab.Screen name="Mektuplar" component={TemplateStack} />
          <Tab.Screen name="Test" component={QuizScreen} />
          <Tab.Screen name="Defterim" component={SavedScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </StoreProvider>
  );
}
