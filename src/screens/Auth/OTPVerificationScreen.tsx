import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import WdText from '../../components/common/WdText';
import WdButton from '../../components/common/WdButton';
import WdImage from '../../components/common/WdImage';
import { useAuth } from '../../context/AuthContext';

const OTP_LENGTH = 6;
const RESEND_TIMER = 60; // seconds

const OTPVerificationScreen = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const styles = createStyles(theme);
  const { phoneNumber } = route?.params || { phoneNumber: '' };

  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');

    // Handle paste - if pasting multiple digits
    if (numericText.length > 1) {
      handlePaste(numericText);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (numericText && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all fields are filled
    if (index === OTP_LENGTH - 1 && numericText) {
      const isComplete = newOtp.every(digit => digit !== '');
      if (isComplete) {
        handleVerifyOTP(newOtp.join(''));
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current field is empty, focus previous field
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (pastedText: string) => {
    const numericText = pastedText.replace(/[^0-9]/g, '');
    const otpArray = numericText.slice(0, OTP_LENGTH).split('');

    const newOtp = new Array(OTP_LENGTH).fill('');
    otpArray.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });

    setOtp(newOtp);
    setError('');

    // Focus the next empty field or the last field
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      // Auto-verify if all filled
      if (newOtp.every(digit => digit !== '')) {
        handleVerifyOTP(newOtp.join(''));
      }
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const otpToVerify = otpCode || otp.join('');

    if (otpToVerify.length !== OTP_LENGTH) {
      setError('Please enter complete OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Verifying OTP:', otpToVerify, 'for phone:', phoneNumber);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate success/failure
      const isValid = true; // Replace with actual API response

      if (isValid) {
        // Navigate to home or next screen
        console.log('OTP verified successfully!');
        await login('temp-token', {
          id: 'temp-user',
          name: 'User',
          email: 'user@example.com',
          phone: phoneNumber || '',
          role: 'user',
          verified: true,
        });
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp(new Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
      setOtp(new Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      setLoading(true);
      setError('');

      console.log('Resending OTP to:', phoneNumber);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset timer and state
      setResendTimer(RESEND_TIMER);
      setCanResend(false);
      setOtp(new Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();

      // Show success message (you can use a toast notification)
      console.log('OTP sent successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const visibleDigits = 4;
    const countryCodeEnd = phone.indexOf(' ') + 1;
    const visiblePart = phone.slice(-visibleDigits);
    const maskedPart = '*'.repeat(
      phone.length - countryCodeEnd - visibleDigits,
    );
    return (
      phone.slice(0, countryCodeEnd) +
      maskedPart.match(/.{1,3}/g)?.join(' ') +
      ' ' +
      visiblePart
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <WdImage
              source={require('../../assets/images/recycle-icon.png')}
              imageStyle={styles.recycleIcon}
            />
          </View>

          {/* Title */}
          <WdText
            label="OTP Verification"
            fontSize={32}
            isBold
            style={styles.title}
          />

          {/* Subtitle with phone number */}
          <WdText
            label={`Enter the 6-digit code sent to\n${formatPhoneNumber(
              phoneNumber,
            )}`}
            fontSize={16}
            style={styles.subtitle}
          />

          {/* OTP Input Fields */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : {},
                  error ? styles.otpInputError : {},
                ]}
                value={digit}
                onChangeText={text => handleOtpChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
              />
            ))}
          </View>

          {/* Error Message */}
          {error ? (
            <WdText
              label={error}
              color={theme.colors.error}
              style={styles.errorText}
            />
          ) : null}

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <WdText
              label="Didn't receive the code? "
              fontSize={14}
              style={styles.resendText}
            />
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={!canResend || loading}
              activeOpacity={0.7}
            >
              <WdText
                label={
                  canResend
                    ? 'Resend OTP'
                    : `Resend in ${formatTime(resendTimer)}`
                }
                style={[
                  styles.resendButton,
                  { color: canResend ? theme.colors.appBg : '#999' },
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <WdButton
            title={loading ? 'Verifying...' : 'Verify OTP'}
            onPress={() => handleVerifyOTP()}
            disabled={loading || otp.some(digit => digit === '')}
            style={styles.verifyButton}
          />

          {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <WdText
              label="← Change phone number"
              fontSize={14}
              color={theme.colors.appBg}
              style={styles.backText}
            />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 60,
      justifyContent: 'flex-start',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    recycleIcon: {
      width: 120,
      height: 120,
    },
    title: {
      textAlign: 'center',
      marginBottom: 12,
      paddingTop: 25,
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: 10,
      color: '#666',
      lineHeight: 24,
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingHorizontal: 10,
    },
    otpInput: {
      width: 50,
      height: 56,
      borderWidth: 2,
      borderColor: '#DDD',
      borderRadius: 12,
      textAlign: 'center',
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
      backgroundColor: '#F8F8F8',
    },
    otpInputFilled: {
      borderColor: theme.colors.appBg,
      backgroundColor: '#FFF',
    },
    otpInputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 8,
    },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 25,
    },
    resendText: {
      color: '#666',
    },
    resendButton: {
      fontSize: 14,
      fontWeight: '600',
    },
    verifyButton: {
      backgroundColor: theme.colors.appBg,
      marginTop: 8,
    },
    backButton: {
      marginTop: 24,
      alignItems: 'center',
      paddingVertical: 12,
    },
    backText: {
      textAlign: 'center',
    },
  });

export default OTPVerificationScreen;
