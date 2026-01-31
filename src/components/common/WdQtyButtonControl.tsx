import { StyleSheet, TouchableOpacity, View } from 'react-native';
import WdIcon from './WdIcon';
import WdText from './WdText';
import { Theme } from '../../types/theme';
import { useTheme } from '../../context/ThemeContext';
import { CartItem } from '../cart/item';

type WdQtyButtonControlProps = {
  item: CartItem;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  disabled?: boolean;
};

const WdQtyButtonControl: React.FC<WdQtyButtonControlProps> = ({
  item,
  onUpdateQuantity,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.quantityControl}>
      <TouchableOpacity
        style={styles.quantityButton}
        disabled={disabled}
        onPress={() =>
          onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
        }
      >
        <WdIcon name="remove" size={16} color={theme.colors.primary} />
      </TouchableOpacity>
      <WdText
        labelKey={item.quantity.toString()}
        fontSize={14}
        isBold
        style={styles.qtyText}
      />
      <TouchableOpacity
        style={[
          styles.quantityButton,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
        disabled={disabled}
        onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
      >
        <WdIcon name="add" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default WdQtyButtonControl;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    quantityButton: {
      width: 25,
      height: 25,
      borderRadius: 12.5,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.colors.primary,
    },
    qtyText: {
      marginHorizontal: 8,
      minWidth: 20,
      textAlign: 'center',
    },
  });
