import { router, Tabs } from 'expo-router';

import { FabTabButton } from '@/components/FabTabButton';
import { Icon } from '@/components/Icon';
import { colors } from '@/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hangar',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="flightline"
        options={{
          title: 'Flightline',
          tabBarIcon: ({ color, size }) => (
            <Icon name="airplane-outline" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="new-post-tab"
        options={{
          title: '',
          tabBarButton: (props) => <FabTabButton onPress={props.onPress} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/new-post');
          },
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => (
            <Icon name="notifications-outline" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color as string} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
