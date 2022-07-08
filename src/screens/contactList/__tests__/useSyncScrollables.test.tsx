import 'react-native';
import React from 'react';

import {act, create, ReactTestRenderer} from 'react-test-renderer';
import {useSyncScrollables} from '../useSyncScrollables';
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';

type ScrollMockProps = {
  tag: string;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onTouchEventStart: () => void;
};

type ScrollToOffsetFn = (params: {animated: false; offset: number}) => void;

const ScrollMock = (_: ScrollMockProps): React.ReactElement => {
  return <></>;
};

describe('useSyncScrollables test', () => {
  test('propagates scroll from first to second', () => {
    const scrollToOffsetFirst: ScrollToOffsetFn = jest.fn();
    const scrollToOffsetSecond: ScrollToOffsetFn = jest.fn();

    const TestComponent = (): React.ReactElement => {
      const {
        first: {onScroll: onScrollFirst, onTouchEventStart: onTouchFirst},
        second: {onScroll: onScrollSecond, onTouchEventStart: onTouchSecond},
      } = useSyncScrollables(
        {
          horizontal: true,
          itemSize: 10,
          itemSpacing: 0,
          scrollToOffset: scrollToOffsetFirst,
        },
        {
          horizontal: false,
          itemSize: 100,
          itemSpacing: 0,
          scrollToOffset: scrollToOffsetSecond,
        },
      );

      return (
        <>
          <ScrollMock
            tag={'first'}
            onScroll={onScrollFirst}
            onTouchEventStart={onTouchFirst}
          />
          <ScrollMock
            tag={'second'}
            onScroll={onScrollSecond}
            onTouchEventStart={onTouchSecond}
          />
        </>
      );
    };

    let root: ReactTestRenderer;
    act(() => {
      root = create(<TestComponent />);
    });

    act(() => {
      const props = root!.root.findByProps({tag: 'first'})
        .props as ScrollMockProps;
      props.onTouchEventStart();
      props.onScroll({
        nativeEvent: {
          contentOffset: {x: 20, y: 0},
        },
      } as NativeSyntheticEvent<NativeScrollEvent>);
    });

    expect(scrollToOffsetSecond).toBeCalledTimes(1);
    expect(scrollToOffsetSecond).toBeCalledWith({
      animated: false,
      offset: 200,
    });
  });
  test('propagates scroll from second to first', () => {
    const scrollToOffsetFirst: ScrollToOffsetFn = jest.fn();
    const scrollToOffsetSecond: ScrollToOffsetFn = jest.fn();

    const TestComponent = (): React.ReactElement => {
      const {
        first: {onScroll: onScrollFirst, onTouchEventStart: onTouchFirst},
        second: {onScroll: onScrollSecond, onTouchEventStart: onTouchSecond},
      } = useSyncScrollables(
        {
          horizontal: true,
          itemSize: 10,
          itemSpacing: 0,
          scrollToOffset: scrollToOffsetFirst,
        },
        {
          horizontal: false,
          itemSize: 100,
          itemSpacing: 0,
          scrollToOffset: scrollToOffsetSecond,
        },
      );

      return (
        <>
          <ScrollMock
            tag={'first'}
            onScroll={onScrollFirst}
            onTouchEventStart={onTouchFirst}
          />
          <ScrollMock
            tag={'second'}
            onScroll={onScrollSecond}
            onTouchEventStart={onTouchSecond}
          />
        </>
      );
    };

    let root: ReactTestRenderer;
    act(() => {
      root = create(<TestComponent />);
    });

    act(() => {
      const props = root!.root.findByProps({tag: 'second'})
        .props as ScrollMockProps;
      props.onTouchEventStart();
      props.onScroll({
        nativeEvent: {
          contentOffset: {x: 0, y: 400},
        },
      } as NativeSyntheticEvent<NativeScrollEvent>);
    });

    expect(scrollToOffsetFirst).toBeCalledTimes(1);
    expect(scrollToOffsetFirst).toBeCalledWith({
      animated: false,
      offset: 40,
    });
  });
});
