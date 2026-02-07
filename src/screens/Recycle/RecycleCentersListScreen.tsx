import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import WdText from '../../components/common/WdText';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../components/common/WdSearch';

const { height } = Dimensions.get('window');
const DRAWER_MIN_HEIGHT = height * 0.5; // Collapsed state
const DRAWER_MAX_HEIGHT = height * 0.75; // Expanded state

interface RecycleCenter {
  id: string;
  name: string;
  rating: number;
  distance: string;
  hours: string;
  materials: string[];
  latitude: number;
  longitude: number;
}

const RecycleCentersListScreen = ({ isFromPickUpScreen = false }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  // Drawer animation
  const drawerHeight = useRef(new Animated.Value(DRAWER_MIN_HEIGHT)).current;
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);

  // Sample data
  const [RecycleCenters] = useState<RecycleCenter[]>([
    {
      id: '1',
      name: 'EcoCenter Principal',
      rating: 4.8,
      distance: '0.8 km',
      hours: '20:00',
      materials: ['Plástico', 'Papel', 'Vidrio', '+2'],
      latitude: 9.9345,
      longitude: -84.0877,
    },
    {
      id: '2',
      name: 'Recicla Verde',
      rating: 4.6,
      distance: '1.2 km',
      hours: '19:00',
      materials: ['Plástico', 'Papel', 'Cartón'],
      latitude: 9.928,
      longitude: -84.082,
    },
    {
      id: '3',
      name: 'Centro Eco Amigo',
      rating: 4.9,
      distance: '0.4 km',
      hours: '21:00',
      materials: ['Plástico', 'Vidrio', 'Aluminio'],
      latitude: 9.94,
      longitude: -84.09,
    },
  ]);

  const materialCategories = ['Plástico', 'Vidrio', 'Cartón', 'Aluminio'];

  // Pan responder for draggable drawer
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = DRAWER_MIN_HEIGHT - gestureState.dy;
        if (newHeight >= DRAWER_MIN_HEIGHT && newHeight <= DRAWER_MAX_HEIGHT) {
          drawerHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          // Swipe up - expand
          expandDrawer();
        } else if (gestureState.dy > 50) {
          // Swipe down - collapse
          collapseDrawer();
        } else {
          // Return to current state
          if (isDrawerExpanded) {
            expandDrawer();
          } else {
            collapseDrawer();
          }
        }
      },
    }),
  ).current;

  const expandDrawer = () => {
    setIsDrawerExpanded(true);
    Animated.spring(drawerHeight, {
      toValue: DRAWER_MAX_HEIGHT,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
  };

  const collapseDrawer = () => {
    setIsDrawerExpanded(false);
    Animated.spring(drawerHeight, {
      toValue: DRAWER_MIN_HEIGHT,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material],
    );
  };

  const handleMarkerPress = (center: RecycleCenter) => {
    mapRef.current?.animateToRegion({
      latitude: center.latitude,
      longitude: center.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  };

  const handleCenterPress = (center: RecycleCenter) => {
    // Navigate to detail screen
    navigation.navigate('RecycleDetail', {
      isFromPickUpScreen: true,
      centerId: center.id,
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* HEADER WITH BACK BUTTON AND SEARCH - Positioned absolutely */}
      <SafeAreaView
        style={[styles.headerContainer, { top: isFromPickUpScreen ? 0 : 60 }]}
        edges={['bottom']}
      >
        <View
          style={[
            styles.header,
            { paddingHorizontal: isFromPickUpScreen ? 0 : 16 },
          ]}
        >
          {!isFromPickUpScreen && (
            <TouchableOpacity
              style={[
                styles.backBtn,
                { backgroundColor: theme.colors.background },
              ]}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}

          <View style={styles.searchWrapper}>
            <SearchBar onSearch={setSearchQuery} />
          </View>
        </View>

        {/* MATERIAL FILTERS - Below search bar */}
        {!isFromPickUpScreen && (
          <View style={styles.filterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {materialCategories.map(material => (
                <TouchableOpacity
                  key={material}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selectedMaterials.includes(material)
                        ? theme.colors.appBg
                        : theme.colors.background,
                      borderColor: selectedMaterials.includes(material)
                        ? theme.colors.appBg
                        : theme.colors.text,
                    },
                  ]}
                  onPress={() => toggleMaterial(material)}
                >
                  <WdText
                    label={material}
                    fontSize={16}
                    color={
                      selectedMaterials.includes(material)
                        ? '#fff'
                        : theme.colors.text
                    }
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>

      {/* MAP - Fills entire screen */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 9.9345,
          longitude: -84.0877,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {RecycleCenters.map(center => (
          <Marker
            key={center.id}
            coordinate={{
              latitude: center.latitude,
              longitude: center.longitude,
            }}
            onPress={() => handleMarkerPress(center)}
          >
            <View style={styles.customMarker}>
              <View style={styles.markerNameContainer}>
                <WdText
                  label={center.name}
                  fontSize={14}
                  isBold
                  style={styles.markerName}
                />
              </View>
              <View style={styles.markerIconContainer}>
                <View style={styles.markerIconInner}>
                  <Icon name="location" size={24} color="#fff" />
                </View>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* DRAGGABLE BOTTOM DRAWER */}
      <Animated.View
        style={[
          styles.drawer,
          {
            height: drawerHeight,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        {/* DRAWER HANDLE - Draggable area */}
        <View {...panResponder.panHandlers} style={styles.drawerHandleArea}>
          <View style={styles.drawerHandle} />
        </View>

        {/* DRAWER HEADER */}
        <View style={styles.drawerHeader}>
          <View>
            <WdText label="Centros Cercanos" fontSize={22} isBold />
            <WdText
              label={`${RecycleCenters.length} lugares encontrados`}
              color={theme.colors.placeholder}
              fontSize={14}
              style={{ marginTop: 4 }}
            />
          </View>
          <TouchableOpacity>
            <Icon name="options-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* LIST */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {RecycleCenters.map((center, index) => (
            <TouchableOpacity
              key={center.id}
              style={[
                styles.centerCard,
                {
                  borderBottomWidth: index < RecycleCenters.length - 1 ? 1 : 0,
                  borderBottomColor: theme.colors.border || '#E0E0E0',
                },
              ]}
              onPress={() => handleCenterPress(center)}
            >
              {/* IMAGE */}
              <View style={styles.centerImage}>
                <View style={styles.imagePlaceholder}>
                  <Icon name="leaf-outline" size={40} color="#fff" />
                </View>
              </View>

              {/* INFO */}
              <View style={styles.centerInfo}>
                <WdText label={center.name} fontSize={18} isBold />

                <View style={styles.centerMeta}>
                  {/* RATING */}
                  <View style={styles.metaItem}>
                    <Icon name="star" size={16} color="#FFC107" />
                    <WdText
                      label={center.rating.toString()}
                      fontSize={14}
                      style={{ marginLeft: 4 }}
                    />
                  </View>

                  {/* DISTANCE */}
                  <View style={styles.metaItem}>
                    <Icon
                      name="location-outline"
                      size={16}
                      color={theme.colors.placeholder}
                    />
                    <WdText
                      label={center.distance}
                      fontSize={14}
                      color={theme.colors.placeholder}
                      style={{ marginLeft: 4 }}
                    />
                  </View>

                  {/* HOURS */}
                  <View style={styles.metaItem}>
                    <Icon
                      name="time-outline"
                      size={16}
                      color={theme.colors.placeholder}
                    />
                    <WdText
                      label={center.hours}
                      fontSize={14}
                      color={theme.colors.placeholder}
                      style={{ marginLeft: 4 }}
                    />
                  </View>
                </View>

                {/* MATERIALS */}
                <View style={styles.materialsContainer}>
                  {center.materials.map((material, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.materialBadge,
                        {
                          backgroundColor: material.startsWith('+')
                            ? '#F5F5F5'
                            : '#E8F5E9',
                        },
                      ]}
                    >
                      <WdText
                        label={material}
                        fontSize={13}
                        color={
                          material.startsWith('+')
                            ? theme.colors.placeholder
                            : '#4CAF50'
                        }
                      />
                    </View>
                  ))}
                </View>
              </View>

              {/* CHEVRON */}
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default RecycleCentersListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    // top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 16,
    paddingTop: 8,
    paddingRight: 0,
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
  searchWrapper: {
    flex: 1,
  },
  filterContainer: {
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 0.7,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    marginBottom: DRAWER_MIN_HEIGHT,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerNameContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  markerName: {
    color: '#000',
  },
  markerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  markerIconInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  drawerHandleArea: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  drawerHandle: {
    width: 48,
    height: 5,
    backgroundColor: '#D0D0D0',
    borderRadius: 3,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  centerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  centerImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerInfo: {
    flex: 1,
    gap: 8,
  },
  centerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  materialBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
