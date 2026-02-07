import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import WdText from '../../components/common/WdText';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DateOption {
  id: string;
  dayName: string;
  date: string;
  fullDate: Date;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const SchedulePickUpScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  // Get selected materials from previous step
  const { selectedMaterials } = route.params || { selectedMaterials: [] };

  const [selectedDate, setSelectedDate] = useState<string>('wed14');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('slot1');

  // Generate next 4 days
  const dateOptions: DateOption[] = [
    {
      id: 'tue12',
      dayName: 'Mar',
      date: '12',
      fullDate: new Date(2026, 1, 12),
    },
    {
      id: 'wed13',
      dayName: 'Mañana',
      date: 'Mar 13',
      fullDate: new Date(2026, 1, 13),
    },
    {
      id: 'wed14',
      dayName: 'Mié',
      date: '14',
      fullDate: new Date(2026, 1, 14),
    },
    {
      id: 'thu15',
      dayName: 'Jue',
      date: '15',
      fullDate: new Date(2026, 1, 15),
    },
  ];

  const timeSlots: TimeSlot[] = [
    { id: 'slot1', time: '9:00 - 11:00', available: true },
    { id: 'slot2', time: '11:00 - 13:00', available: true },
    { id: 'slot3', time: '13:00 - 15:00', available: true },
    { id: 'slot4', time: '15:00 - 17:00', available: true },
    { id: 'slot5', time: '17:00 - 19:00', available: true },
  ];

  const handleContinue = () => {
    const selectedDateObj = dateOptions.find(d => d.id === selectedDate);
    const selectedTimeObj = timeSlots.find(t => t.id === selectedTimeSlot);

    // Navigate to next step with all data
    navigation.navigate('RecycleCenterSelection', {
      selectedMaterials,
      selectedDate: selectedDateObj,
      selectedTime: selectedTimeObj,
    });
  };

  const getSelectedDateTime = () => {
    const dateObj = dateOptions.find(d => d.id === selectedDate);
    const timeObj = timeSlots.find(t => t.id === selectedTimeSlot);

    if (dateObj && timeObj) {
      return `${dateObj.dayName} ${dateObj.date} • ${timeObj.time}`;
    }
    return '';
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
            label="¿Cuándo recogemos?"
            fontSize={20}
            isBold
            color={theme.colors.text}
          />
          <WdText
            label="Elige fecha y hora"
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
          <View style={[styles.progressBar, styles.progressActive]} />
          <View style={[styles.progressBar, styles.progressInActive]} />
        </View>

        {/* DATE SELECTION */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="calendar-outline" size={20} color={theme.colors.text} />
            <WdText
              label="Selecciona el día"
              fontSize={16}
              isBold
              color={theme.colors.text}
              style={{ marginLeft: 8 }}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContainer}
          >
            {dateOptions.map(date => {
              const isSelected = selectedDate === date.id;
              return (
                <TouchableOpacity
                  key={date.id}
                  style={[
                    styles.dateCard,
                    {
                      backgroundColor: isSelected
                        ? '#E8F5E9'
                        : theme.colors.background,
                      borderColor: isSelected ? '#4CAF50' : '#E0E0E0',
                    },
                  ]}
                  onPress={() => setSelectedDate(date.id)}
                  activeOpacity={0.7}
                >
                  <WdText
                    label={date.dayName}
                    fontSize={14}
                    color={theme.colors.placeholder}
                  />
                  <WdText
                    label={date.date}
                    fontSize={18}
                    isBold
                    color={theme.colors.text}
                    style={{ marginTop: 4 }}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* TIME SLOT SELECTION */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="time-outline" size={20} color={theme.colors.text} />
            <WdText
              label="Horario de recolección"
              fontSize={16}
              isBold
              color={theme.colors.text}
              style={{ marginLeft: 8 }}
            />
          </View>

          <View style={styles.timeSlotsContainer}>
            {timeSlots.map(slot => {
              const isSelected = selectedTimeSlot === slot.id;
              return (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlotCard,
                    {
                      backgroundColor: isSelected
                        ? '#E8F5E9'
                        : theme.colors.background,
                      borderColor: isSelected ? '#4CAF50' : '#E0E0E0',
                    },
                  ]}
                  onPress={() => setSelectedTimeSlot(slot.id)}
                  activeOpacity={0.7}
                  disabled={!slot.available}
                >
                  <View style={styles.timeSlotLeft}>
                    <Icon
                      name="time-outline"
                      size={20}
                      color={isSelected ? '#4CAF50' : theme.colors.placeholder}
                    />
                    <WdText
                      label={slot.time}
                      fontSize={16}
                      color={theme.colors.text}
                      style={{ marginLeft: 12 }}
                    />
                  </View>
                  <WdText
                    label="Disponible"
                    fontSize={14}
                    color={isSelected ? '#4CAF50' : theme.colors.placeholder}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* INFO CARD */}
        <View style={[styles.infoCard, { backgroundColor: '#E3F2FD' }]}>
          <View style={styles.infoIconWrapper}>
            <Icon name="information-circle" size={24} color="#2196F3" />
          </View>
          <View style={styles.infoContent}>
            <WdText
              label="Tiempo estimado"
              fontSize={14}
              isBold
              color={theme.colors.text}
            />
            <WdText
              label="El recolector llegará en el horario seleccionado. Te avisaremos cuando esté cerca."
              fontSize={14}
              color="#2196F3"
              style={{ marginTop: 4 }}
            />
          </View>
        </View>

        {/* SELECTED DATE TIME SUMMARY */}
        <View style={styles.summaryContainer}>
          <WdText
            label={getSelectedDateTime()}
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
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <WdText label="CONTINUAR" fontSize={16} isBold color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SchedulePickUpScreen;

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
  titleContainer: {
    flex: 1,
    paddingTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
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
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateScrollContainer: {
    gap: 12,
    paddingRight: 16,
  },
  dateCard: {
    width: 90,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  timeSlotsContainer: {
    gap: 12,
  },
  timeSlotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  timeSlotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoIconWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoContent: {
    flex: 1,
  },
  summaryContainer: {
    alignItems: 'center',
    marginTop: 8,
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
    backgroundColor: '#4CAF50',
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
