import {AppTheme, useThemedStyles} from '@theme';
import React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

const _MoreButton = ({style, onPress}: Props): React.ReactElement => {
  const styles = useThemedStyles(styleFn);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, style]}>
        <Text style={styles.text}>Go To Contact Page</Text>
      </View>
    </TouchableOpacity>
  );
};

const BUTTON_HEIGHT = 40;

const styleFn = (theme: AppTheme) => ({
  container: {
    height: BUTTON_HEIGHT,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: theme.colors.onBackgroundBorder,
    borderWidth: 1,
    borderRadius: BUTTON_HEIGHT / 2,
  } as ViewStyle,
  text: {
    ...theme.typography.button,
    color: theme.colors.secondaryDark,
  } as TextStyle,
});

export const MoreButton = React.memo(_MoreButton);
