import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  BackHandler,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

export type RouteParamMap<
  TName extends string = string,
  TParams extends {} = {},
> = Record<TName, TParams>;

export type Routes<TRouteParamMap extends RouteParamMap> = Record<
  keyof TRouteParamMap,
  Route<TRouteParamMap, keyof TRouteParamMap>
>;

export type Route<
  TRouteParamMap extends RouteParamMap,
  TRouteName extends keyof TRouteParamMap = keyof TRouteParamMap,
> = {
  key?: (params: TRouteParamMap[TRouteName]) => string;
  render: (
    params: TRouteParamMap[TRouteName],
    navigate: (
      routeName: keyof TRouteParamMap,
      params: TRouteParamMap[keyof TRouteParamMap],
    ) => void,
    goBack: () => void,
  ) => React.ReactElement;
};

export type RouteNames<TRouteParamMap extends RouteParamMap> =
  keyof TRouteParamMap;
export type RouteParams<
  TRouteParamMap,
  TRouteName extends keyof TRouteParamMap = keyof TRouteParamMap,
> = TRouteParamMap[TRouteName];

export type StackEntry<
  TRouteParamMap extends RouteParamMap,
  TRouteName extends RouteNames<TRouteParamMap> = RouteNames<TRouteParamMap>,
> = {
  name: TRouteName;
  params: RouteParams<TRouteParamMap, TRouteName>;
};

const _EntryWrapper = <
  TRouteParamMap extends RouteParamMap,
  Entry extends StackEntry<TRouteParamMap>,
>({
  route,
  entry,
  navigate,
  goBack,
}: {
  route: Route<TRouteParamMap, Entry['name']>;
  entry: Entry;
  navigate: (
    name: StackEntry<TRouteParamMap>['name'],
    params: StackEntry<TRouteParamMap>['params'],
  ) => void;
  goBack: () => void;
}): React.ReactElement => {
  return route.render(entry.params, navigate, goBack);
};

const EntryWrapper = React.memo(_EntryWrapper) as typeof _EntryWrapper;

export type StackNavigatorProps<TRouteParamMap extends RouteParamMap> = {
  style?: StyleProp<ViewStyle>;
  initialState: Array<StackEntry<TRouteParamMap>>;
  routes: Routes<TRouteParamMap>;
};

/**
 * A basic stack navigator. Renders an array (backstack) of screens on top of each other.
 * Routes define how backstack entries are rendered.
 * Backstack entries represent the state of a navigator: diplayed screens and their params.
 */
export const StackNavigator = <TRouteParamMap extends RouteParamMap>({
  style,
  initialState,
  routes,
}: StackNavigatorProps<TRouteParamMap>) => {
  const [currentState, setCurrentState] = useState(initialState);

  const currentStateRef = useRef(currentState);
  currentStateRef.current = currentState;

  const [width, setWidth] = useState(0);
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  const currentTransition = useRef(new Animated.Value(0));
  const isTransitioning = useRef(false);

  const startTransition = useCallback(
    (backwards: boolean = false, onFinish?: () => void) => {
      isTransitioning.current = true;
      currentTransition.current.setValue(!backwards ? 0 : 1);

      currentTransition.current.addListener(({value}: {value: number}) => {
        if (value === (!backwards ? 1 : 0)) {
          currentTransition.current.removeAllListeners();
          isTransitioning.current = false;
          onFinish?.();
        }
      });

      Animated.timing(currentTransition.current, {
        toValue: !backwards ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    },
    [],
  );

  const navigate = useCallback(
    (
      name: StackEntry<TRouteParamMap>['name'],
      params: StackEntry<TRouteParamMap>['params'],
    ) => {
      if (isTransitioning.current) {
        return;
      }
      setCurrentState(prev => [...prev, {name, params}]);
      startTransition(false);
    },
    [startTransition],
  );

  const canGoBack = useCallback(
    (): boolean => currentStateRef.current.length > 1,
    [],
  );

  const goBack = useCallback(() => {
    if (isTransitioning.current || !canGoBack()) {
      return;
    }
    startTransition(true, () =>
      setCurrentState(prev => prev.slice(0, prev.length - 1)),
    );
  }, [canGoBack, startTransition]);

  useEffect(() => {
    const backAction = () => {
      if (canGoBack()) {
        goBack();
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [canGoBack, goBack]);

  return (
    <View style={style} onLayout={onLayout}>
      {currentState.map((entry, index) => (
        <Animated.View
          key={[entry.name, routes[entry.name].key?.(entry.params)]
            .filter(segment => segment !== undefined)
            .join('_')}
          style={[
            StyleSheet.absoluteFill,
            {zIndex: index},
            index === currentState.length - 1 && isTransitioning.current
              ? {
                  transform: [
                    {
                      translateX: currentTransition.current.interpolate({
                        inputRange: [0, 1],
                        outputRange: [width, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                }
              : {},
          ]}>
          <EntryWrapper<TRouteParamMap, StackEntry<TRouteParamMap>>
            route={routes[entry.name]}
            entry={entry}
            navigate={navigate}
            goBack={goBack}
          />
        </Animated.View>
      ))}
    </View>
  );
};
