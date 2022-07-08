import 'react-native';
import React from 'react';

import {act, create, ReactTestRenderer} from 'react-test-renderer';
import {ColorValue} from 'react-native';
import {useThemedStyles} from '../themeUtils';
import {ThemeProvider} from '../ThemeContext';
import {AppTheme} from '../AppTheme';

const appThemeMock = {colors: {primary: '#fff'}} as AppTheme;

const ViewMock = (_: {tag: 'view'; color: ColorValue}): React.ReactElement => {
  return <></>;
};

const ConsumerMock = (): React.ReactElement => {
  const style = useThemedStyles(theme => ({
    testColor: theme.colors.primary as ColorValue,
  }));
  return <ViewMock tag={'view'} color={style.testColor} />;
};

describe('ThemeContext test', () => {
  test('Renders a view with a style from useThemedStyles', () => {
    let root: ReactTestRenderer;
    act(() => {
      root = create(
        <ThemeProvider value={appThemeMock}>
          <ConsumerMock />
        </ThemeProvider>,
      );
    });

    expect(
      (
        root!.root.findByProps({tag: 'view'}).props as {
          color: ColorValue;
        }
      ).color,
    ).toEqual(appThemeMock.colors.primary);
  });
  test("Throws an error if there's no ThemeProvider", () => {
    expect(() =>
      act(() => {
        create(<ConsumerMock />);
      }),
    ).toThrowError();
  });
});
