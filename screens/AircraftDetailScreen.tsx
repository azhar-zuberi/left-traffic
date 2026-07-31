import { useLocalSearchParams } from 'expo-router';

import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export function AircraftDetailScreen() {
  const { aircraftId } = useLocalSearchParams<{ aircraftId: string }>();

  return (
    <ScreenPlaceholder
      dark
      title="Aircraft Detail"
      description={`Aircraft ${aircraftId}`}
    />
  );
}
