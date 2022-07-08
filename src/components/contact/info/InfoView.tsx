import {AppTheme, useThemedStyles} from '@theme';
import React, {useCallback} from 'react';
import {View, Text, StyleProp, ViewStyle, TextStyle} from 'react-native';
import {MoreButton} from '../../moreButton';

export type InfoData = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  description: string;
};

type InfoViewProps = {
  style?: StyleProp<ViewStyle>;
  info: InfoData;
  onMoreButtonPress?: (info: InfoData) => void;
};

const _InfoView = ({style, info, onMoreButtonPress}: InfoViewProps) => {
  const handleMorePress = useCallback(() => {
    onMoreButtonPress?.(info);
  }, [info, onMoreButtonPress]);

  const styles = useThemedStyles(styleFn);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.nameContainer}>
        <Text style={styles.firstName}>{`${info.firstName} `}</Text>
        <Text style={styles.lastName}>{info.lastName}</Text>
      </View>
      <Text style={styles.role}>{info.role}</Text>
      <Text style={styles.about}>About me</Text>
      <Text style={styles.description}>{info.description}</Text>
      {!!onMoreButtonPress && <MoreButton onPress={handleMorePress} />}
    </View>
  );
};

const styleFn = (theme: AppTheme) => ({
  container: {
    paddingHorizontal: 20,
  } as ViewStyle,
  nameContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 8,
  } as ViewStyle,
  firstName: {
    ...theme.typography.headline2Bold,
    color: theme.colors.onBackground,
  } as TextStyle,
  lastName: {
    ...theme.typography.headline2,
    color: theme.colors.onBackground,
  } as TextStyle,
  role: {
    ...theme.typography.subtitle,
    color: theme.colors.onBackgroundLight,
    marginBottom: 32,
    alignSelf: 'center',
  } as TextStyle,
  about: {
    ...theme.typography.subtitleBold,
    color: theme.colors.onBackground,
    marginBottom: 12,
  } as TextStyle,
  description: {
    ...theme.typography.body,
    color: theme.colors.onBackground,
    marginBottom: 12,
  } as TextStyle,
});

export const InfoView = React.memo(_InfoView);
