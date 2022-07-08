import {AppTheme, useThemedStyles} from '@theme';
import React from 'react';
import {
  ImageStyle,
  Platform,
  StatusBar,
  StatusBarStyle,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {BackButton} from './BackButton';

type Props = {
  style?: StyleProp<ViewStyle>;
  title: string;
  onBackPress?: () => void;
};

export const AppBar = (props: Props): React.ReactElement => {
  const platform = Platform.OS;

  switch (platform) {
    case 'ios':
      return <IosAppBar {...props} />;
    case 'android':
      return <AndroidAppBar {...props} />;
    default:
      return <></>;
  }
};

const AndroidAppBar = ({
  style,
  title,
  onBackPress,
}: Props): React.ReactElement => {
  const styles = useThemedStyles(styleFnAndroid);

  return (
    <View style={[styles.container, style]}>
      <StatusBar
        backgroundColor={styles.statusBar.color}
        barStyle={styles.statusBar.barStyle}
      />
      {!!onBackPress && (
        <BackButton style={styles.backButton} onPress={onBackPress} />
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const IosAppBar = ({style, title, onBackPress}: Props): React.ReactElement => {
  const styles = useThemedStyles(styleFnIos);

  return (
    <>
      <View style={[styles.container, style]}>
        <View style={styles.horizontalContainer}>
          <View style={styles.leftContainer}>
            {!!onBackPress && (
              <BackButton style={styles.backButton} onPress={onBackPress} />
            )}
          </View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.rightContainer} />
        </View>
        <View style={styles.divider} />
      </View>
    </>
  );
};

const styleFnAndroid = (theme: AppTheme) => ({
  title: {
    ...theme.typography.appBar,
    color: theme.colors.onBackground,
  } as TextStyle,
  backButton: {marginRight: 12} as ImageStyle,
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    elevation: 4,
    paddingHorizontal: 16,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'flex-start',
  } as ViewStyle,
  statusBar: {
    color: theme.colors.primaryDark,
    barStyle: 'dark-content' as StatusBarStyle,
  },
});

const styleFnIos = (theme: AppTheme) => ({
  title: {
    ...theme.typography.appBar,
    color: theme.colors.onBackground,
    marginHorizontal: 10,
    marginBottom: 14,
  } as TextStyle,
  backButton: {marginStart: 4, marginBottom: 12} as ImageStyle,
  container: {
    minHeight: 56 + 44,
    backgroundColor: theme.colors.primary,
    padddingTop: 44,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  horizontalContainer: {
    minHeight: 56,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  } as ViewStyle,
  statusBar: {
    barStyle: 'dark-content' as StatusBarStyle,
  },
  divider: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.primaryDark,
    height: 1,
  } as ViewStyle,
  leftContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  } as ViewStyle,
  rightContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  } as ViewStyle,
});
