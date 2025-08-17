// app/(tabs)/praias.tsx
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import BeachList from '@/components/BeachList';


export default function BeachScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Praias</ThemedText>
      <BeachList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
