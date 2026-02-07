import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import WdText from '../../components/common/WdText';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Material {
  id: string;
  name: string;
  description: string;
  icon: string;
  emoji?: string;
}

const ScheduleStep1MaterialSelection = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const materials: Material[] = [
    {
      id: 'plastic',
      name: 'Plástico',
      description: 'Botellas, envases, bolsas',
      icon: 'recycle',
      emoji: '♻️',
    },
    {
      id: 'paper',
      name: 'Papel y Cartón',
      description: 'Revistas, cajas, periódicos',
      icon: 'document-outline',
      emoji: '📄',
    },
    {
      id: 'glass',
      name: 'Vidrio',
      description: 'Botellas, frascos, envases',
      icon: 'wine-outline',
      emoji: '🍾',
    },
    {
      id: 'metal',
      name: 'Metal',
      description: 'Latas, aluminio, acero',
      icon: 'can-outline',
      emoji: '🥫',
    },
    {
      id: 'electronics',
      name: 'Electrónicos',
      description: 'Celulares, cables, pilas',
      icon: 'phone-portrait-outline',
      emoji: '📱',
    },
    {
      id: 'organic',
      name: 'Orgánico',
      description: 'Restos de comida, hojas',
      icon: 'leaf-outline',
      emoji: '🌿',
    },
  ];

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials(prev =>
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId],
    );
  };

  const handleContinue = () => {
    if (selectedMaterials.length > 0) {
      // Navigate to next step with selected materials
      navigation.navigate('SchedulePickUp', {
        selectedMaterials,
      });
    }
  };

  const getProgressWidth = () => {
    return '33.33%'; // Step 1 of 3
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        {/* TITLE */}
        <View style={styles.titleContainer}>
          <WdText
            label="¿Qué vas a reciclar?"
            fontSize={20}
            isBold
            color={theme.colors.text}
          />
          <WdText
            label="Selecciona los materiales"
            fontSize={16}
            color={theme.colors.placeholder}
            style={{ marginTop: 8 }}
          />
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PROGRESS BAR */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, styles.progressActive]} />
          <View style={[styles.progressBar, styles.progressInActive]} />
          <View style={[styles.progressBar, styles.progressInActive]} />
        </View>

        {/* MATERIALS LIST */}
        <View style={styles.materialsContainer}>
          {materials.map((material, index) => {
            const isSelected = selectedMaterials.includes(material.id);
            const isFirst = index === 0;

            return (
              <TouchableOpacity
                key={material.id}
                style={[
                  styles.materialCard,
                  {
                    backgroundColor: isSelected
                      ? '#E8F5E9'
                      : theme.colors.background,
                    borderColor: isSelected ? '#4CAF50' : '#E0E0E0',
                  },
                  isFirst && styles.materialCardFirst,
                ]}
                onPress={() => toggleMaterial(material.id)}
                activeOpacity={0.7}
              >
                {/* ICON */}
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isSelected ? '#fff' : '#F5F5F5',
                    },
                  ]}
                >
                  <WdText label={material.emoji || ''} fontSize={28} />
                </View>

                {/* INFO */}
                <View style={styles.materialInfo}>
                  <WdText
                    label={material.name}
                    fontSize={16}
                    isBold
                    color={theme.colors.text}
                  />
                  <WdText
                    label={material.description}
                    fontSize={14}
                    color={theme.colors.placeholder}
                    style={{ marginTop: 4 }}
                  />
                </View>

                {/* CHECKBOX */}
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected ? '#4CAF50' : '#D0D0D0',
                      backgroundColor: isSelected ? '#4CAF50' : 'transparent',
                    },
                  ]}
                >
                  {isSelected && (
                    <Icon name="checkmark" size={20} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SELECTION COUNT */}
        <View style={styles.selectionCount}>
          <WdText
            label={`${selectedMaterials.length} material${
              selectedMaterials.length !== 1 ? 'es' : ''
            } seleccionado${selectedMaterials.length !== 1 ? 's' : ''}`}
            fontSize={14}
            color={theme.colors.placeholder}
          />
        </View>
      </ScrollView>

      {/* BOTTOM BUTTON */}
      <View
        style={[
          styles.bottomContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor:
                selectedMaterials.length > 0 ? '#4CAF50' : '#E0E0E0',
            },
          ]}
          onPress={handleContinue}
          disabled={selectedMaterials.length === 0}
          activeOpacity={0.8}
        >
          <WdText
            label="CONTINUAR"
            fontSize={16}
            isBold
            color={selectedMaterials.length > 0 ? '#fff' : '#9E9E9E'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ScheduleStep1MaterialSelection;

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
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  titleContainer: {
    flex: 1,
    paddingTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16,
  },
  progressActive: {
    backgroundColor: '#4CAF50',
  },
  progressInActive: {
    backgroundColor: '#E0E0E0',
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  materialsContainer: {
    gap: 12,
  },
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    gap: 12,
  },
  materialCardFirst: {
    // Special styling for first selected card if needed
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  materialInfo: {
    flex: 1,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionCount: {
    alignItems: 'center',
    marginTop: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  continueButton: {
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
