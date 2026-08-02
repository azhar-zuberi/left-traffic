import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/FormField';
import { Icon } from '@/components/Icon';
import { useAppData } from '@/hooks/useAppData';
import { colors, spacing, typography } from '@/theme';

export function EditAircraftScreen() {
  const { aircraftId } = useLocalSearchParams<{ aircraftId: string }>();
  const { aircraft, updateAircraft } = useAppData();
  const aircraftRecord = aircraft.find((a) => a.id === aircraftId);

  const [manufacturer, setManufacturer] = useState(aircraftRecord?.manufacturer ?? '');
  const [model, setModel] = useState(aircraftRecord?.model ?? '');
  const [year, setYear] = useState(String(aircraftRecord?.year ?? ''));
  const [serialNumber, setSerialNumber] = useState(aircraftRecord?.serialNumber ?? '');
  const [engine, setEngine] = useState(aircraftRecord?.engine ?? '');
  const [horsepower, setHorsepower] = useState(String(aircraftRecord?.horsepower ?? ''));
  const [propeller, setPropeller] = useState(aircraftRecord?.propeller ?? '');
  const [usefulLoad, setUsefulLoad] = useState(String(aircraftRecord?.usefulLoad ?? ''));
  const [cruiseSpeed, setCruiseSpeed] = useState(String(aircraftRecord?.cruiseSpeed ?? ''));
  const [range, setRange] = useState(String(aircraftRecord?.range ?? ''));

  if (!aircraftRecord) {
    return (
      <SafeAreaView style={styles.notFoundContainer} edges={['top', 'left', 'right']}>
        <Text style={styles.notFoundText}>Aircraft not found.</Text>
      </SafeAreaView>
    );
  }

  const record = aircraftRecord;
  const canSave = manufacturer.trim().length > 0 && model.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    updateAircraft(record.id, {
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      year: Number(year) || 0,
      serialNumber: serialNumber.trim(),
      engine: engine.trim(),
      horsepower: Number(horsepower) || 0,
      propeller: propeller.trim(),
      usefulLoad: Number(usefulLoad) || 0,
      cruiseSpeed: Number(cruiseSpeed) || 0,
      range: Number(range) || 0,
    });
    router.back();
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backButton}>
            <Icon name="chevron-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Aircraft</Text>
          <Pressable onPress={handleSave} hitSlop={8} style={styles.saveButton}>
            <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>Save</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.formGroup}>
            <FormField label="Registration" value={record.registration} editable={false} />
            <FormField
              label="Manufacturer"
              value={manufacturer}
              onChangeText={setManufacturer}
              placeholder="Piper"
            />
            <FormField
              label="Model"
              value={model}
              onChangeText={setModel}
              placeholder="PA-28-181 Archer"
            />
            <FormField
              label="Year"
              value={year}
              onChangeText={setYear}
              placeholder="1978"
              keyboardType="number-pad"
              autoCapitalize="none"
            />
            <FormField
              label="Serial Number"
              value={serialNumber}
              onChangeText={setSerialNumber}
              placeholder="28-7890123"
              autoCapitalize="characters"
            />
            <FormField label="Engine" value={engine} onChangeText={setEngine} placeholder="Lycoming O-360" />
            <FormField
              label="Horsepower"
              value={horsepower}
              onChangeText={setHorsepower}
              placeholder="180"
              keyboardType="number-pad"
              autoCapitalize="none"
            />
            <FormField
              label="Propeller"
              value={propeller}
              onChangeText={setPropeller}
              placeholder="2 Blade Metal"
            />
            <FormField
              label="Useful Load (lbs)"
              value={usefulLoad}
              onChangeText={setUsefulLoad}
              placeholder="890"
              keyboardType="number-pad"
              autoCapitalize="none"
            />
            <FormField
              label="Cruise Speed (KTAS)"
              value={cruiseSpeed}
              onChangeText={setCruiseSpeed}
              placeholder="140"
              keyboardType="number-pad"
              autoCapitalize="none"
            />
            <FormField
              label="Range (NM)"
              value={range}
              onChangeText={setRange}
              placeholder="640"
              keyboardType="number-pad"
              autoCapitalize="none"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  notFoundText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 32,
  },
  headerTitle: {
    ...typography.screenTitle,
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    minWidth: 32,
    alignItems: 'flex-end',
  },
  saveText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.accent,
  },
  saveTextDisabled: {
    color: colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  formGroup: {
    gap: spacing.md,
  },
});
