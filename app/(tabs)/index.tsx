import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleOpenBeachesTab = () => {
router.push('/(tabs)/beachs')
  };

  const handleNearestBeach = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos da sua localização para abrir as praias próximas.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir configurações', onPress: () => Location.enableNetworkProviderAsync().catch(() => {}) },
          ]
        );
        // fallback: abre busca genérica por “praias”
        await Linking.openURL('https://www.google.com/maps/search/praias+perto+de+mim');
        return;
      }

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const lat = pos.coords.latitude.toFixed(6);
      const lng = pos.coords.longitude.toFixed(6);

      // Tenta Google Maps (iOS/Android), cai para Apple Maps (iOS) e depois web
      const tryUrls: string[] = [];

      if (Platform.OS === 'ios') {
        tryUrls.push(`comgooglemaps://?q=Praias&center=${lat},${lng}&zoom=12`);
        tryUrls.push(`maps://?q=Praias&ll=${lat},${lng}`); // Apple Maps
      } else {
        // Android entende geo: e Google Maps assume o app por padrão
        tryUrls.push(`geo:${lat},${lng}?q=Praias`);
        tryUrls.push(`comgooglemaps://?q=Praias&center=${lat},${lng}&zoom=12`);
      }

      // web fallback
      tryUrls.push(`https://www.google.com/maps/search/Praias/@${lat},${lng},12z`);

      for (const url of tryUrls) {
        const can = await Linking.canOpenURL(url);
        if (can) {
          await Linking.openURL(url);
          return;
        }
      }
    } catch (e) {
      console.log('Erro ao abrir mapas:', e);
      Alert.alert('Ops', 'Não foi possível abrir o mapa agora.');
    }
  };

  const openImaSite = () => {
    Linking.openURL('https://balneabilidade.ima.sc.gov.br/');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      {/* Título */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Ver Praia</ThemedText>
        <ThemedText type="subtitle">Qualidade da água em SC</ThemedText>
      </ThemedView>

      {/* CTAs */}
      <View style={styles.actions}>
        <PrimaryButton label="Praia mais próxima" onPress={handleNearestBeach} />
        <SecondaryButton label="Ver praias" onPress={handleOpenBeachesTab} />
      </View>

      {/* Informações */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Origem dos dados</ThemedText>
        <ThemedText>
          As informações de balneabilidade vêm do{' '}
          <ThemedText type="link" onPress={openImaSite}>IMA-SC</ThemedText>.
          As medições são realizadas periodicamente nos pontos de coleta oficiais.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Privacidade</ThemedText>
        <ThemedText>
          Sua localização é usada apenas quando você toca em “Praia mais próxima”, para abrir o mapa
          na região. Não armazenamos nem enviamos sua posição aos nossos servidores.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.tip}>
        <ThemedText type="defaultSemiBold">Dica</ThemedText>
        <ThemedText>
          Quer ver detalhes por cidade e ponto de coleta? Use a tab “Praias”.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.8 }]}>
      <ThemedText style={styles.btnText}>{label}</ThemedText>
    </Pressable>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.9 }]}>
      <ThemedText style={styles.btnSecondaryText}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  titleContainer: {
    gap: 4,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  btnPrimary: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9', 
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
  btnSecondary: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  btnSecondaryText: {
    fontWeight: '700',
    color: '#0ea5e9',
  },
  card: {
    gap: 6,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  tip: {
    gap: 6,
    marginBottom: 24,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(14,165,233,0.08)',
  },
});
