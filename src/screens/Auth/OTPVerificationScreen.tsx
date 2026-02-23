import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import BaseApi from '../../service/baseApi';
import { showToast } from '../../utils/ToastService';

const OTP_LENGTH = 6;
const RESEND_TIMER = 60;

const OTPVerificationScreen = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const styles = createStyles(theme);

  const { phoneNumber, otpReceived } = route?.params || {
    phoneNumber: '',
    otpReceived: '',
  };

  // Convert otpReceived string (e.g. "123456") into string[] (e.g. ['1','2','3','4','5','6'])
  const parseOtpString = (otpStr: string): string[] => {
    const digits =
      otpStr
        ?.toString()
        .replace(/[^0-9]/g, '')
        .slice(0, OTP_LENGTH)
        .split('') || [];
    // Pad with empty strings if shorter than OTP_LENGTH
    return [...digits, ...new Array(OTP_LENGTH - digits.length).fill('')];
  };

  const [otp, setOtp] = useState<string[]>(() => parseOtpString(otpReceived));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Timer — runs once on mount only
  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Populate OTP from parent + auto-focus first empty field (or verify if complete)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (otpReceived) {
        const parsed = parseOtpString(otpReceived);
        setOtp(parsed);

        const isComplete = parsed.every(d => d !== '');
        if (isComplete) {
          // Auto-verify if parent passed a full OTP
          handleVerifyOTP(parsed.join(''));
        } else {
          // Focus first empty slot
          const firstEmpty = parsed.findIndex(d => d === '');
          inputRefs.current[firstEmpty !== -1 ? firstEmpty : 0]?.focus();
        }
      } else {
        // No OTP from parent, just focus first input
        inputRefs.current[0]?.focus();
      }
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpReceived]);

  const resetOtp = useCallback(() => {
    setOtp(new Array(OTP_LENGTH).fill(''));
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  const handleVerifyOTP = useCallback(
    async (otpCode?: string) => {
      const otpToVerify = otpCode ?? otp.join('');

      if (otpToVerify.length !== OTP_LENGTH) {
        setError('Please enter the complete OTP');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await BaseApi.post('/auth/verify-otp', {
          otp: otpToVerify,
          phone: phoneNumber,
        });

        if (response.success) {
          showToast('success', 'OTP Verified', 'OTP verified successfully!');
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
          resetOtp();
        }
      } catch (err: any) {
        setError(err.message || 'Verification failed. Please try again.');
        resetOtp();
      } finally {
        setLoading(false);
      }
    },
    [otp, phoneNumber, login, resetOtp],
  );

  const handleOtpChange = useCallback(
    (text: string, index: number) => {
      const numericText = text.replace(/[^0-9]/g, '');

      // Handle paste of multiple digits
      if (numericText.length > 1) {
        const otpArray = numericText.slice(0, OTP_LENGTH).split('');
        const newOtp = new Array(OTP_LENGTH).fill('');
        otpArray.forEach((digit, idx) => {
          newOtp[idx] = digit;
        });
        setOtp(newOtp);
        setError('');

        const nextEmpty = newOtp.findIndex((d: string) => d === '');
        if (nextEmpty !== -1) {
          inputRefs.current[nextEmpty]?.focus();
        } else {
          inputRefs.current[OTP_LENGTH - 1]?.focus();
          if (newOtp.every((d: string) => d !== '')) {
            handleVerifyOTP(newOtp.join(''));
          }
        }
        return;
      }

      const newOtp = [...otp];
      newOtp[index] = numericText;
      setOtp(newOtp);
      setError('');

      if (numericText && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (index === OTP_LENGTH - 1 && numericText) {
        if (newOtp.every((d: string) => d !== '')) {
          handleVerifyOTP(newOtp.join(''));
        }
      }
    },
    [otp, handleVerifyOTP],
  );

  const handleKeyPress = useCallback(
    (e: any, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handleResendOTP = useCallback(async () => {
    if (!canResend || loading) return;

    try {
      setLoading(true);
      setError('');

      await BaseApi.post('/auth/send-otp', { phone: phoneNumber });

      showToast(
        'success',
        'OTP Sent',
        'A new OTP has been sent to your phone.',
      );
      setCanResend(false);
      setResendTimer(RESEND_TIMER);
      resetOtp();

      // Restart countdown
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [canResend, loading, phoneNumber, resetOtp]);

  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    const visibleDigits = 4;
    const spaceIndex = phone.indexOf(' ');
    const countryCodeEnd = spaceIndex !== -1 ? spaceIndex + 1 : 0;
    const visiblePart = phone.slice(-visibleDigits);
    const maskedLength = phone.length - countryCodeEnd - visibleDigits;
    const maskedPart = '*'.repeat(Math.max(0, maskedLength));
    const groupedMask = maskedPart.match(/.{1,3}/g)?.join(' ') ?? '';
    return `${phone.slice(0, countryCodeEnd)}${groupedMask} ${visiblePart}`;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOtpComplete = otp.every(d => d !== '');

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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

          {/* Subtitle */}
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
                maxLength={2}
                selectTextOnFocus
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                editable={!loading}
              />
            ))}
          </View>

          {/* Error Message */}
          {!!error && (
            <WdText
              label={error}
              color={theme.colors.error}
              style={styles.errorText}
            />
          )}

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
            disabled={loading || !isOtpComplete}
            style={styles.verifyButton}
          />

          {loading && (
            <ActivityIndicator
              style={styles.loader}
              color={theme.colors.appBg}
              size="small"
            />
          )}

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
            disabled={loading}
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
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 40,
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
      marginTop: 24,
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
      marginTop: 4,
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
    loader: {
      marginTop: 12,
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
