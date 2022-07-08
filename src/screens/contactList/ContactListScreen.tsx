import {ContactRepository} from '@data';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  LayoutChangeEvent,
  Dimensions,
  FlatList,
  Animated,
  View,
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
import {useSyncScrollables} from './useSyncScrollables';

const SCROLL_EVENT_THROTTLE = 8;

const extractIdKey = ({id}: {id: string}) => id;

type Props = {
  navigateToContactDetails: (contactId: string) => void;
};

export const buildContactListScreen = (
  contactRepository: ContactRepository,
) => {
  return function ContactListScreen({navigateToContactDetails}: Props) {
    // Map data
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

    // Calculate item sizes
    const [infoListHeight, setInfoListHeight] = useState(0);
    const onInfoListLayout = useCallback((event: LayoutChangeEvent) => {
      setInfoListHeight(event.nativeEvent.layout.height);
    }, []);

    const avatarListOffset =
      Dimensions.get('window').width / 2 - AVATAR_SIZE / 2;

    // Animate avatar list index
    const avatarIndex = useRef(new Animated.Value(0));
    const updateAvatarIndex = useCallback((targetIndex: number) => {
      avatarIndex.current.setValue(targetIndex);
    }, []);

    // Sync scroll states
    const avatarListRef = useRef<FlatList<AvatarData>>(null);
    const infoListRef = useRef<FlatList<InfoData>>(null);

    const avatarListScrollToOffset = useCallback(
      (params: {animated: false; offset: number}) => {
        avatarListRef.current?.scrollToOffset(params);
      },
      [],
    );
    const infoListScrollToOffset = useCallback(
      (params: {animated: false; offset: number}) => {
        infoListRef.current?.scrollToOffset(params);
      },
      [],
    );

    const {
      first: {
        onScroll: onAvatarListScroll,
        onTouchEventStart: onAvatarListTouch,
      },
      second: {onScroll: onInfoListScroll, onTouchEventStart: onInfoListTouch},
    } = useSyncScrollables(
      useMemo(
        () => ({
          horizontal: true,
          itemSize: AVATAR_SIZE,
          itemSpacing: AVATAR_LIST_SPACING,
          onScroll: updateAvatarIndex,
          scrollToOffset: avatarListScrollToOffset,
        }),
        [avatarListScrollToOffset, updateAvatarIndex],
      ),
      useMemo(
        () => ({
          horizontal: false,
          itemSize: infoListHeight,
          itemSpacing: 0,
          scrollToOffset: infoListScrollToOffset,
        }),
        [infoListHeight, infoListScrollToOffset],
      ),
    );

    const onAvatarPress = useCallback((avatar: AvatarData) => {
      avatarListRef.current?.scrollToItem({animated: true, item: avatar});
    }, []);

    // Render items
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
        <AppBar style={styles.appBar} title={'Contacts'} />
        <FixedSizeList<AvatarData>
          horizontal
          style={styles.avatarList}
          offset={avatarListOffset}
          itemSize={AVATAR_SIZE}
          itemSpacing={AVATAR_LIST_SPACING}
          ref={avatarListRef}
          onTouchStart={onAvatarListTouch}
          onScroll={onAvatarListScroll}
          data={avatars}
          keyExtractor={extractIdKey}
          renderItem={renderAvatarListItem}
          scrollEventThrottle={SCROLL_EVENT_THROTTLE}
        />
        <FixedSizeList<InfoData>
          style={styles.infoList}
          onLayout={onInfoListLayout}
          itemSize={infoListHeight}
          itemSpacing={0}
          offset={0}
          ref={infoListRef}
          onTouchStart={onInfoListTouch}
          onScroll={onInfoListScroll}
          data={contactInfos}
          keyExtractor={extractIdKey}
          renderItem={renderInfoListItem}
          decelerationRate={'fast'}
          scrollEventThrottle={SCROLL_EVENT_THROTTLE}
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
