import React, {Ref, useCallback, useMemo} from 'react';
import {FlatList, FlatListProps, View} from 'react-native';

export type FixedSizeListProps<T> = {
  offset: number;
  itemSize: number;
  itemSpacing: number;
} & FlatListProps<T>;

const _FixedSizeListFn = <T,>(
  {
    itemSize,
    itemSpacing,
    offset,
    data,
    contentContainerStyle,
    horizontal,
    renderItem,
    ...props
  }: FixedSizeListProps<T>,
  ref: Ref<FlatList<T>>,
) => {
  const ItemSeparatorComponent = useCallback(
    () => <Spacer size={itemSpacing} />,
    [itemSpacing],
  );

  const _renderItem = useMemo<FlatListProps<T>['renderItem']>(
    () =>
      renderItem
        ? (...args) => {
            return (
              <View style={horizontal ? {width: itemSize} : {height: itemSize}}>
                {renderItem(...args)}
              </View>
            );
          }
        : undefined,
    [horizontal, itemSize, renderItem],
  );

  return (
    <FlatList<T>
      ref={ref}
      contentContainerStyle={[
        horizontal
          ? {
              paddingHorizontal: offset,
            }
          : {
              paddingVertical: offset,
            },
        contentContainerStyle,
      ]}
      getItemLayout={(_, index) => ({
        length: itemSize + itemSpacing,
        offset: (itemSize + itemSpacing) * index,
        index,
      })}
      snapToInterval={itemSize + itemSpacing}
      data={data}
      ItemSeparatorComponent={ItemSeparatorComponent}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      renderItem={_renderItem}
      {...props}
    />
  );
};

export const FixedSizeList = React.memo(React.forwardRef(_FixedSizeListFn)) as <
  T,
>(
  p: FixedSizeListProps<T> & {ref?: Ref<FlatList<T>>},
) => React.ReactElement;

const Spacer = ({size}: {size: number}) => (
  <View style={{width: size, height: size}} />
);
