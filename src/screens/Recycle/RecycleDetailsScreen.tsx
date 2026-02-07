import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import WdText from '../../components/common/WdText';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

interface Material {
  name: string;
  icon?: string;
}

interface Schedule {
  day: string;
  hours: string;
}

interface RecycleCenterDetail {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  hours: string;
  image: string;
  address: {
    city: string;
    details: string;
  };
  materials: Material[];
  schedule: Schedule[];
  phone: string;
  latitude: number;
  longitude: number;
}

const RecycleDetailsScreen = () => {
  const route =
    useRoute<
      RouteProp<
        { params: { isFromPickUpScreen: boolean; centerId: string } },
        'params'
      >
    >();
  const { isFromPickUpScreen = false } = route.params;
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Sample data - in real app, this would come from route params or API
  const centerData: RecycleCenterDetail = {
    id: '1',
    name: 'EcoCenter Principal',
    rating: 4.8,
    reviewCount: 248,
    distance: '0.8 km',
    hours: 'Abierto hasta 20:00',
    image: 'https://via.placeholder.com/400x200',
    address: {
      city: 'San Jose, Sabana Norte',
      details: 'Plaza Dominguez, Edificio 8, Bodegas',
    },
    materials: [
      { name: 'Plástico' },
      { name: 'Papel' },
      { name: 'Vidrio' },
      { name: 'Metal' },
      { name: 'Cartón' },
      { name: 'Aluminio (Latas)' },
    ],
    schedule: [
      { day: 'Lunes - Viernes', hours: '8:00 AM - 8:00 PM' },
      { day: 'Sábado', hours: '9:00 AM - 6:00 PM' },
      { day: 'Domingo', hours: '10:00 AM - 4:00 PM' },
    ],
    phone: '+1 (555) 123-4567',
    latitude: 9.9345,
    longitude: -84.0877,
  };

  const handleCall = () => {
    Linking.openURL(`tel:${centerData.phone}`);
  };

  const handleShare = () => {
    // Implement share functionality
  };

  const handleBookmark = () => {
    // Implement bookmark functionality
  };

  const handleConfirmation = () => {
    if (isFromPickUpScreen) {
      navigation.navigate('PickUpConfirmation');
    }
  };
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.headerBtn,
              { backgroundColor: theme.colors.background },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.headerBtn,
                { backgroundColor: theme.colors.background },
              ]}
              onPress={handleShare}
            >
              <Icon name="share-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.headerBtn,
                { backgroundColor: theme.colors.background },
              ]}
              onPress={handleBookmark}
            >
              <Icon
                name="bookmark-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Icon name="leaf" size={60} color="#fff" />
            <WdText
              label="recycle here"
              fontSize={24}
              color="#fff"
              isBold
              style={{ marginTop: 8 }}
            />
          </View>
          <View style={styles.distanceBadge}>
            <WdText label={centerData.distance} fontSize={14} color="#000" />
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* NAME & RATING */}
          <View style={styles.section}>
            <WdText label={centerData.name} fontSize={24} isBold />
            <View style={styles.ratingRow}>
              <Icon name="star" size={20} color="#FFC107" />
              <WdText
                label={`${centerData.rating} (${centerData.reviewCount} reviews)`}
                fontSize={16}
                style={{ marginLeft: 6 }}
              />
            </View>
          </View>

          {/* HOURS & DISTANCE */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon
                name="time-outline"
                size={20}
                color={theme.colors.placeholder}
              />
              <View style={{ marginLeft: 8 }}>
                <WdText
                  label="Horario"
                  fontSize={14}
                  color={theme.colors.placeholder}
                />
                <WdText label={centerData.hours} fontSize={14} isBold />
              </View>
            </View>

            <View style={styles.infoItem}>
              <Icon
                name="location-outline"
                size={20}
                color={theme.colors.placeholder}
              />
              <View style={{ marginLeft: 8 }}>
                <WdText
                  label="Distancia"
                  fontSize={14}
                  color={theme.colors.placeholder}
                />
                <WdText label={centerData.distance} fontSize={14} isBold />
              </View>
            </View>
          </View>

          {/* ADDRESS */}
          <View
            style={[
              styles.addressContainer,
              { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' },
            ]}
          >
            <Icon name="location" size={20} color="#4CAF50" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <WdText label="Dirección" fontSize={14} color="#4CAF50" isBold />
              <WdText
                label={centerData.address.city}
                fontSize={14}
                color="#4CAF50"
                style={{ marginTop: 2 }}
              />
              <WdText
                label={centerData.address.details}
                fontSize={14}
                color="#4CAF50"
              />
            </View>
          </View>

          {/* MATERIALS */}
          <View style={styles.section}>
            <WdText label="Materiales Aceptados" fontSize={18} isBold />
            <View style={styles.materialsGrid}>
              {centerData.materials.map((material, index) => (
                <View
                  key={index}
                  style={[styles.materialChip, { backgroundColor: '#E8F5E9' }]}
                >
                  <View style={styles.materialDot} />
                  <WdText label={material.name} fontSize={14} color="#000" />
                </View>
              ))}
            </View>
          </View>

          {/* SCHEDULE */}
          <View style={styles.section}>
            <WdText label="Horarios de Atención" fontSize={18} isBold />
            <View style={styles.scheduleContainer}>
              {centerData.schedule.map((item, index) => (
                <View key={index} style={styles.scheduleRow}>
                  <WdText
                    label={item.day}
                    fontSize={14}
                    color={theme.colors.text}
                    style={{ flex: 1 }}
                  />
                  <WdText
                    label={item.hours}
                    fontSize={14}
                    color={theme.colors.text}
                    isBold
                  />
                </View>
              ))}
            </View>
          </View>

          {/* CONTACT */}
          <View style={styles.section}>
            <WdText label="Contacto" fontSize={18} isBold />
            <TouchableOpacity
              style={[
                styles.contactCard,
                { backgroundColor: '#E3F2FD', borderColor: '#2196F3' },
              ]}
              onPress={handleCall}
            >
              <View
                style={[
                  styles.contactIconContainer,
                  { backgroundColor: '#2196F3' },
                ]}
              >
                <Icon name="call" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <WdText
                  label="Teléfono"
                  fontSize={14}
                  color={theme.colors.placeholder}
                />
                <WdText
                  label={centerData.phone}
                  fontSize={16}
                  color="#2196F3"
                  isBold
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* BOOK BUTTON */}
          <TouchableOpacity
            style={[styles.bookButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => handleConfirmation()}
          >
            <WdText
              label={
                isFromPickUpScreen ? 'ASSIGN COLLECTOR' : 'SCHEDULE DROP-OFF'
              }
              fontSize={16}
              color="#fff"
              isBold
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecycleDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 32,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  materialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  materialChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: '45%',
  },
  materialDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  scheduleContainer: {
    marginTop: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
});
