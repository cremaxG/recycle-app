import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import WdText from '../../components/common/WdText';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RecollectionData {
  location: {
    address: string;
  };
  materials: string[];
  date: string;
  timeSlot: string;
  center: {
    name: string;
    vehicleType: string;
  };
}

const PickUpConfirmationScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Sample data - would come from route params or state management
  const [recollectionData] = useState<RecollectionData>({
    location: {
      address: 'Av. Reforma 123, Centro',
    },
    materials: ['Plástico'],
    date: '2026-01-14',
    timeSlot: '9:00 - 11:00',
    center: {
      name: 'EcoCenter Principal',
      vehicleType: 'Camion Verde EcoTruck',
    },
  });

  const handleEdit = (section: string) => {
    // Navigate back to edit specific section
    console.log('Edit section:', section);
  };

  const handleContinue = () => {
    // Navigate to next step or confirm
    console.log('Continue with recollection');
  };

  const handleCancel = () => {
    // Cancel and go back
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'bottom']}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        {/* TITLE SECTION */}
        <View style={styles.titleSection}>
          <WdText label="Confirmación de la Recolecta" fontSize={20} isBold />
          <WdText
            label="Revisa que todo este bien"
            fontSize={16}
            color={theme.colors.placeholder}
            style={{ marginTop: 8 }}
          />
        </View>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PROGRESS INDICATORS */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, styles.progressActive]} />
          <View style={[styles.progressBar, styles.progressActive]} />
          <View style={[styles.progressBar, styles.progressActive]} />
        </View>

        {/* LOCATION CARD */}
        <View style={[styles.card, { borderColor: theme.colors.divider }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitle}>
              <Icon name="location" size={24} color="#4CAF50" />
              <WdText
                label="Ubicación"
                fontSize={18}
                isBold
                style={{ marginLeft: 8 }}
              />
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('location')}
            >
              <Icon name="create-outline" size={20} color="#4CAF50" />
              <WdText
                label="Editar"
                fontSize={16}
                color="#4CAF50"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <WdText
              label={recollectionData.location.address}
              fontSize={16}
              color={theme.colors.text}
            />
          </View>
        </View>

        {/* MATERIALS CARD */}
        <View style={[styles.card, { borderColor: theme.colors.divider }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitle}>
              <Icon name="cube-outline" size={24} color="#4CAF50" />
              <WdText
                label="Materiales"
                fontSize={18}
                isBold
                style={{ marginLeft: 8 }}
              />
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('materials')}
            >
              <Icon name="create-outline" size={20} color="#4CAF50" />
              <WdText
                label="Editar"
                fontSize={16}
                color="#4CAF50"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.materialsContainer}>
              {recollectionData.materials.map((material, index) => (
                <View key={index} style={styles.materialChip}>
                  <Icon name="leaf" size={16} color="#4CAF50" />
                  <WdText
                    label={material}
                    fontSize={15}
                    color="#4CAF50"
                    style={{ marginLeft: 6 }}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* DATE & TIME CARD */}
        <View style={[styles.card, { borderColor: theme.colors.divider }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitle}>
              <Icon name="calendar" size={24} color="#4CAF50" />
              <WdText
                label="Fecha y Hora"
                fontSize={18}
                isBold
                style={{ marginLeft: 8 }}
              />
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('datetime')}
            >
              <Icon name="create-outline" size={20} color="#4CAF50" />
              <WdText
                label="Editar"
                fontSize={16}
                color="#4CAF50"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <WdText
              label={recollectionData.date}
              fontSize={16}
              color={theme.colors.text}
              style={{ marginBottom: 8 }}
            />
            <View style={styles.timeRow}>
              <Icon
                name="time-outline"
                size={18}
                color={theme.colors.placeholder}
              />
              <WdText
                label={recollectionData.timeSlot}
                fontSize={16}
                color={theme.colors.text}
                style={{ marginLeft: 8 }}
              />
            </View>
          </View>
        </View>

        {/* CENTER CARD */}
        <View style={[styles.card, { borderColor: theme.colors.divider }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitle}>
              <Icon name="business" size={24} color="#4CAF50" />
              <WdText
                label={recollectionData.center.name}
                fontSize={18}
                isBold
                style={{ marginLeft: 8 }}
              />
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('center')}
            >
              <Icon name="create-outline" size={20} color="#4CAF50" />
              <WdText
                label="Editar"
                fontSize={16}
                color="#4CAF50"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <WdText
              label={recollectionData.center.vehicleType}
              fontSize={16}
              color={theme.colors.text}
            />
          </View>
        </View>

        {/* CHECKLIST CARD */}
        <View style={[styles.checklistCard, { backgroundColor: '#EBF4FF' }]}>
          <WdText
            label="Antes de la recolección:"
            fontSize={16}
            isBold
            color="#1565C0"
            style={{ marginBottom: 16 }}
          />
          <View style={styles.checklistItem}>
            <Icon name="checkmark-circle" size={20} color="#1565C0" />
            <WdText
              label="Separa los materiales por tipo"
              fontSize={15}
              color="#1565C0"
              style={{ marginLeft: 12, flex: 1 }}
            />
          </View>
          <View style={styles.checklistItem}>
            <Icon name="checkmark-circle" size={20} color="#1565C0" />
            <WdText
              label="Limpia los envases (sin residuos)"
              fontSize={15}
              color="#1565C0"
              style={{ marginLeft: 12, flex: 1 }}
            />
          </View>
          <View style={styles.checklistItem}>
            <Icon name="checkmark-circle" size={20} color="#1565C0" />
            <WdText
              label="Ten todo listo en la puerta"
              fontSize={15}
              color="#1565C0"
              style={{ marginLeft: 12, flex: 1 }}
            />
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: '#4CAF50' }]}
          onPress={handleContinue}
        >
          <WdText label="CONTINUAR" fontSize={18} isBold color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <WdText label="Cancelar recolección" fontSize={16} color="#F44336" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PickUpConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  progressActive: {
    backgroundColor: '#4CAF50',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    paddingLeft: 32,
  },
  materialsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  materialChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checklistCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  continueButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
