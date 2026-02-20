import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import WdText from '../../components/common/WdText';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

interface UserLocation {
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

const PickUpScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);

  // User location data
  const [userLocation] = useState<UserLocation>({
    address: 'Porvenir, Desamparados, Calle 16',
    city: 'San Jose',
    latitude: 9.9345,
    longitude: -84.0877,
  });

  // Stats
  const [stats] = useState({
    totalCollections: 12,
    lastCollectionDays: 3,
    co2Reduction: 2.5,
  });

  const handleSchedulePickup = () => {
    // Navigate to schedule pickup screen
    navigation.navigate('RecycleTypeSelection');
  };

  const handleChangeLocation = () => {
    // Navigate to location selection screen
    navigation.navigate('LocationSelection');
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* BACK BUTTON - Positioned absolutely */}
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.colors.background }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* MAP - Fills upper portion */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {/* User Location Marker */}
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
          >
            <View style={styles.customMarker}>
              <View style={styles.markerLabel}>
                <WdText
                  label="Tu Ubicación"
                  fontSize={12}
                  isBold
                  style={styles.markerLabelText}
                />
              </View>
              <View style={styles.markerIconContainer}>
                <View style={styles.markerIconInner}>
                  <Icon name="home" size={24} color="#fff" />
                </View>
                <View style={styles.markerPointer} />
              </View>
            </View>
          </Marker>
        </MapView>

        {/* LOCATION CARD OVERLAY */}
        <View style={styles.locationCardOverlay}>
          <View
            style={[
              styles.locationCard,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <View style={styles.locationIconWrapper}>
              <View style={styles.locationIcon}>
                <Icon name="location" size={24} color="#4CAF50" />
              </View>
            </View>
            <View style={styles.locationInfo}>
              <WdText
                label="Tu Ubicación de Recolección"
                fontSize={16}
                isBold
              />
              <WdText
                label={userLocation.address}
                fontSize={14}
                color={theme.colors.text}
                style={{ marginTop: 4 }}
              />
              <WdText
                label={userLocation.city}
                fontSize={14}
                color={theme.colors.text}
              />
              <TouchableOpacity
                style={styles.changeLocationBtn}
                onPress={handleChangeLocation}
              >
                <WdText
                  label="Cambiar ubicación"
                  fontSize={14}
                  color="#4CAF50"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* BOTTOM CONTENT */}
      <View style={styles.bottomContent}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* STATS CARDS */}
          <View style={styles.statsContainer}>
            {/* Collections Card */}
            <View
              style={[
                styles.statCard,
                styles.collectionsCard,
                { backgroundColor: '#E8F5E9' },
              ]}
            >
              <View style={styles.statIconWrapper}>
                <Icon name="cube-outline" size={24} color="#4CAF50" />
              </View>
              <View style={styles.statContent}>
                <WdText label="Recolecciones" fontSize={14} color="#4CAF50" />
                <WdText
                  label={stats.totalCollections.toString()}
                  fontSize={32}
                  isBold
                  color="#4CAF50"
                  style={{ marginTop: 4 }}
                />
              </View>
            </View>

            {/* Last Collection Card */}
            <View
              style={[
                styles.statCard,
                styles.lastCollectionCard,
                { backgroundColor: '#F3E5F5' },
              ]}
            >
              <View style={styles.statIconWrapper}>
                <Icon name="time-outline" size={24} color="#9C27B0" />
              </View>
              <View style={styles.statContent}>
                <WdText label="Última" fontSize={14} color="#9C27B0" />
                <WdText
                  label={`Hace ${stats.lastCollectionDays} días`}
                  fontSize={16}
                  isBold
                  color="#9C27B0"
                  style={{ marginTop: 4 }}
                />
              </View>
            </View>
          </View>

          {/* SCHEDULE BUTTON */}
          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={handleSchedulePickup}
            activeOpacity={0.8}
          >
            <WdText label="AGENDAR COLECTA" fontSize={16} isBold color="#fff" />
          </TouchableOpacity>

          {/* INFO CARD */}
          <View style={[styles.infoCard, { backgroundColor: '#F5F5F5' }]}>
            <View style={styles.infoIconWrapper}>
              <Icon name="bulb-outline" size={24} color="#FFA726" />
            </View>
            <View style={styles.infoContent}>
              <WdText
                label="¿Sabías que...?"
                fontSize={14}
                isBold
                color={theme.colors.text}
              />
              <WdText
                label={`Cada recolección ayuda a reducir hasta ${stats.co2Reduction} kg de CO₂`}
                fontSize={14}
                color="#2196F3"
                style={{ marginTop: 4 }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default PickUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapContainer: {
    height: height * 0.5,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerLabel: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  markerLabelText: {
    color: '#000',
  },
  markerIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIconInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  markerPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4CAF50',
    marginTop: -4,
  },
  locationCardOverlay: {
    position: 'absolute',
    top: 125,
    left: 16,
    right: 16,
  },
  locationCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  locationIconWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  changeLocationBtn: {
    marginTop: 8,
  },
  bottomContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  collectionsCard: {
    // Specific styles if needed
  },
  lastCollectionCard: {
    // Specific styles if needed
  },
  statIconWrapper: {
    marginBottom: 4,
  },
  statContent: {
    gap: 2,
  },
  scheduleButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  infoIconWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoContent: {
    flex: 1,
  },
});
