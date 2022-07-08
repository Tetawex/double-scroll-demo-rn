import {useCallback, useMemo, useRef} from 'react';
import {NativeSyntheticEvent, NativeScrollEvent} from 'react-native';

export type Scrollable = {
  itemSize: number;
  itemSpacing: number;
  horizontal: boolean;
  onScroll?: (
    targetIndex: number,
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => void;
  onTouchEventStart?: () => void;
  scrollToOffset?: (params: {animated: false; offset: number}) => void;
};

type ScrollableCallback = {
  onTouchEventStart: () => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

type ScrollableCallbacks = {
  first: ScrollableCallback;
  second: ScrollableCallback;
};

export const useSyncScrollables = (
  first: Scrollable,
  second: Scrollable,
): ScrollableCallbacks => {
  // Keep track of which scrollable is being interacted with
  const activeScrollable = useRef<'first' | 'second'>('first');
  const onFirstListTouch = useCallback(() => {
    activeScrollable.current = 'first';
    first?.onTouchEventStart?.();
  }, [first]);
  const onSecondListTouch = useCallback(() => {
    activeScrollable.current = 'second';
    second?.onTouchEventStart?.();
  }, [second]);

  // Sync scroll states using item size and spacing parameters
  const onFirstListScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const targetIndex =
        (first.horizontal
          ? event.nativeEvent.contentOffset.x
          : event.nativeEvent.contentOffset.y) /
        (first.itemSize + first.itemSpacing);
      if (activeScrollable.current === 'first') {
        second?.scrollToOffset?.({
          animated: false,
          offset: targetIndex * (second.itemSize + second.itemSpacing),
        });
      }

      first.onScroll?.(targetIndex, event);
    },
    [first, second],
  );
  const onSecondListScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const targetIndex =
        (second.horizontal
          ? event.nativeEvent.contentOffset.x
          : event.nativeEvent.contentOffset.y) /
        (second.itemSize + second.itemSpacing);
      if (activeScrollable.current === 'second') {
        first?.scrollToOffset?.({
          animated: false,
          offset: targetIndex * (first.itemSize + first.itemSpacing),
        });
      }

      second.onScroll?.(targetIndex, event);
    },
    [first, second],
  );

  return {
    first: useMemo(
      () => ({
        onTouchEventStart: onFirstListTouch,
        onScroll: onFirstListScroll,
      }),
      [onFirstListScroll, onFirstListTouch],
    ),
    second: useMemo(
      () => ({
        onTouchEventStart: onSecondListTouch,
        onScroll: onSecondListScroll,
      }),
      [onSecondListScroll, onSecondListTouch],
    ),
  };
};
