import {AppTheme, useThemedStyles} from '@theme';
import React from 'react';
import {
  StyleProp,
  TouchableOpacity,
  Image,
  ImageStyle,
  Platform,
} from 'react-native';

type Props = {style?: StyleProp<ImageStyle>; onPress?: () => void};

const _BackButton = ({style, onPress}: Props): React.ReactElement => {
  const styles = useThemedStyles(styleFn);

  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        style={[styles.icon, style]}
        source={
          Platform.OS === 'ios'
            ? require('@assets/icons/arrow_back_ios.png')
            : require('@assets/icons/arrow_back_android.png')
        }
      />
    </TouchableOpacity>
  );
};

const styleFn = (theme: AppTheme) => ({
  icon: {
    width: 24,
    height: 24,
    tintColor: theme.colors.onPrimary,
  } as ImageStyle,
});

export const BackButton = React.memo(_BackButton);
