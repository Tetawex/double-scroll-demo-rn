import {ContactRepository} from '@data';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  LayoutChangeEvent,
  Dimensions,
  FlatList,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  SafeAreaView,
  View,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {AppBar} from '@components/appBar';
import {
  AvatarData,
  AVATAR_SIZE,
  AVATAR_LIST_SPACING,
  AvatarView,
} from '@components/contact/avatar';
import {InfoData, InfoView} from '@components/contact/info';
import {FixedSizeList} from '@components/fixedSizeList';
import {AppTheme, useThemedStyles} from '@theme';

const extractIdKey = ({id}: {id: string}) => id;

type Props = {
  navigateToContactDetails: (contactId: string) => void;
};

export const buildContactListScreen = (
  contactRepository: ContactRepository,
) => {
  return function ContactListScreen({navigateToContactDetails}: Props) {
    // Data
    const contacts = useMemo(() => contactRepository.getContacts(), []);
    const avatars: Array<AvatarData> = useMemo(
      () => contacts.map<AvatarData>(c => ({id: c.id, avatarUri: c.avatarUri})),
      [contacts],
    );
    const contactInfos: Array<InfoData> = useMemo(
      () =>
        contacts.map<InfoData>(c => ({
          id: c.id,
          firstName: c.firstName,
          firstNasme: c.firstName,
          lastName: c.lastName,
          role: c.role,
          description: c.description,
        })),
      [contacts],
    );

    // Calculating item sizes
    const [infoListHeight, setInfoListHeight] = useState(0);
    const onInfoListLayout = useCallback((event: LayoutChangeEvent) => {
      setInfoListHeight(event.nativeEvent.layout.height);
    }, []);

    const avatarListOffset =
      Dimensions.get('window').width / 2 - AVATAR_SIZE / 2;

    const infoListItemSize = infoListHeight;
    const infoListItemSpacing = 0;

    const avatarListItemSize = AVATAR_SIZE;
    const avatarListItemSpacing = AVATAR_LIST_SPACING;

    // Sync scroll states
    const avatarListRef = useRef<FlatList<AvatarData>>(null);
    const infoListRef = useRef<FlatList<InfoData>>(null);

    const activeScrollable = useRef<'avatar' | 'info'>('avatar');
    const onAvatarListTouch = useCallback(() => {
      activeScrollable.current = 'avatar';
      console.log(activeScrollable.current);
    }, []);
    const onInfoListTouch = useCallback(() => {
      activeScrollable.current = 'info';
      console.log(activeScrollable.current);
    }, []);

    const avatarIndex = useRef(new Animated.Value(0));

    const onAvatarListScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const targetIndex =
          event.nativeEvent.contentOffset.x /
          (avatarListItemSize + avatarListItemSpacing);
        if (activeScrollable.current === 'avatar') {
          infoListRef.current?.scrollToOffset({
            animated: false,
            offset: targetIndex * infoListHeight,
          });
        }
        avatarIndex.current.setValue(targetIndex);
      },
      [avatarListItemSize, avatarListItemSpacing, infoListHeight],
    );
    const onInfoListScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (activeScrollable.current === 'info') {
          const targetIndex =
            event.nativeEvent.contentOffset.y /
            (infoListItemSize + infoListItemSpacing);
          avatarListRef.current?.scrollToOffset({
            animated: false,
            offset: targetIndex * (avatarListItemSize + avatarListItemSpacing),
          });
        }
      },
      [avatarListItemSize, avatarListItemSpacing, infoListItemSize],
    );

    const onAvatarPress = useCallback((avatar: AvatarData) => {
      avatarListRef.current?.scrollToItem({animated: true, item: avatar});
    }, []);

    const renderAvatarListItem = useCallback(
      ({item, index}: {item: AvatarData; index: number}) => (
        <AvatarView
          onAvatarPress={onAvatarPress}
          avatar={item}
          borderOpacity={avatarIndex.current.interpolate({
            inputRange: [
              -0.4,
              index - 0.4,
              index - 0.1,
              index + 0.1,
              index + 0.3,
              avatars.length - 1 + 0.4,
            ],
            outputRange: [0, 0, 1, 1, 0, 0],
            extrapolate: 'identity',
          })}
        />
      ),
      [avatars.length, onAvatarPress],
    );

    const handleInfoViewMorePress = useCallback(
      (info: InfoData) => {
        navigateToContactDetails(info.id);
      },
      [navigateToContactDetails],
    );

    const renderInfoListItem = useCallback(
      ({item}: {item: InfoData}) => (
        <InfoView onMoreButtonPress={handleInfoViewMorePress} info={item} />
      ),
      [handleInfoViewMorePress],
    );

    const styles = useThemedStyles(styleFn);

    return (
        <View style={styles.container}>
          <AppBar
            style={styles.appBar}
            title={"Contacts"}
          />
          <FixedSizeList<AvatarData>
            horizontal
            style={styles.avatarList}
            offset={avatarListOffset}
            itemSize={avatarListItemSize}
            itemSpacing={avatarListItemSpacing}
            ref={avatarListRef}
            onTouchStart={onAvatarListTouch}
            onScroll={onAvatarListScroll}
            data={avatars}
            keyExtractor={extractIdKey}
            renderItem={renderAvatarListItem}
          />
          <FixedSizeList<InfoData>
            style={styles.infoList}
            onLayout={onInfoListLayout}
            itemSize={infoListItemSize}
            itemSpacing={0}
            offset={0}
            ref={infoListRef}
            onTouchStart={onInfoListTouch}
            onScroll={onInfoListScroll}
            data={contactInfos}
            keyExtractor={extractIdKey}
            renderItem={renderInfoListItem}
          />
        </View>
    );
  };
};

const styleFn = (theme: AppTheme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 0,
    width: '100%',
    height: '100%',
  } as ViewStyle,
  appBar: {marginBottom: 24} as ViewStyle,
  appBarText: {
    ...theme.typography.appBar,
    color: theme.colors.onBackground,
  } as TextStyle,
  avatarList: {
    flexShrink: 0,
    flexGrow: 0,
    width: '100%',
    marginBottom: 16,
  },
  infoList: {flexGrow: 1, width: '100%'} as ViewStyle,
});
