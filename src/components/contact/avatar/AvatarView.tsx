import {AppTheme, useThemedStyles} from '@theme';
import React, {useCallback, useMemo} from 'react';
import {
  Animated,
  Image,
  ImageStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

export type AvatarData = {
  id: string;
  avatarUri: string;
};

type AvatarsViewProps = {
  onAvatarPress?: (avatar: AvatarData) => void;
  avatar: AvatarData;
  borderOpacity: Animated.AnimatedNode;
};

const _AvatarView = ({
  onAvatarPress,
  avatar,
  borderOpacity,
}: AvatarsViewProps) => {
  const source = useMemo(
    () => ({
      uri: avatar.avatarUri,
    }),
    [avatar.avatarUri],
  );

  const onPress = useCallback(() => {
    onAvatarPress?.(avatar);
  }, [avatar, onAvatarPress]);

  const styles = useThemedStyles(styleFn);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: borderOpacity,
            } as Animated.AnimatedProps<ViewStyle>,
          ]}
        />
        <Image source={source} style={styles.image} fadeDuration={0} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export const AvatarView = React.memo(_AvatarView);

export const AVATAR_SIZE = 72;
export const AVATAR_IMG_SIZE = 64;
export const AVATAR_LIST_SPACING = 12;

const styleFn = (theme: AppTheme) => ({
  container: {
    position: 'absolute',
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AVATAR_SIZE / 2,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  } as ViewStyle,
  image: {
    position: 'absolute',
    flex: 0,
    margin: (AVATAR_SIZE - AVATAR_IMG_SIZE) / 2,
    width: AVATAR_IMG_SIZE,
    height: AVATAR_IMG_SIZE,
  } as ImageStyle,
});
