import 'react-native';
import React from 'react';

import {act, create, ReactTestRenderer} from 'react-test-renderer';
import {ColorValue} from 'react-native';
import {useThemedStyles} from '../themeUtils';
import {ThemeProvider} from '../ThemeContext';
import {lightAppTheme} from '../AppTheme';

const ViewMock = (_: {color: ColorValue}): React.ReactElement => {
  return <></>;
};

const ConsumerMock = (): React.ReactElement => {
  const style = useThemedStyles(theme => ({
    testColor: theme.colors.primary as ColorValue,
  }));
  return <ViewMock color={style.testColor} />;
};

describe('ThemeContext test', () => {
  test('Renders a view with a style from useThemedStyles', () => {
    let root: ReactTestRenderer;
    act(() => {
      root = create(
        <ThemeProvider value={lightAppTheme}>
          <ConsumerMock />
        </ThemeProvider>,
      );
    });

    expect(
      root!.root.findByProps({color: lightAppTheme.colors.primary}).props as {
        color: ColorValue;
      },
    ).toEqual({color: lightAppTheme.colors.primary});
  });
  test("Throws an error if there's no ThemeProvider", () => {
    expect(() =>
      act(() => {
        create(<ConsumerMock />);
      }),
    ).toThrowError();
  });
});
