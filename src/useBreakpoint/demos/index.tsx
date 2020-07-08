import React from 'react';
import { useBreakpoint } from 'hook';
import { responsiveArray, TBreakpoint } from 'hook/es/_utils/responsiveObserve';

export type ColumnCount = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 24;

export interface ListGridType {
  gutter?: number;
  column?: ColumnCount;
  xs?: ColumnCount;
  sm?: ColumnCount;
  md?: ColumnCount;
  lg?: ColumnCount;
  xl?: ColumnCount;
  xxl?: ColumnCount;
}

const grid: ListGridType = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
};

export default () => {
  const screens = useBreakpoint();
  const columnCount = React.useMemo(() => {
    let count = grid?.column;
    let currentBreakpoint;
    for (let i = 0; i < responsiveArray.length; i += 1) {
      const breakpoint: TBreakpoint = responsiveArray[i];
      if (screens[breakpoint] && grid?.[breakpoint]) {
        count = grid?.[breakpoint];
        currentBreakpoint = breakpoint;
        break;
      }
    }
    return { currentBreakpoint, count };
  }, [screens]);
  return (
    <pre>
      <code>
      <h3>更改屏幕大小，下面的值会跟随变化</h3>
      screens: {JSON.stringify(screens,null,2)}
      <br />
      columnCount: {JSON.stringify(columnCount,null,2)}
      </code>
    </pre>
  );
};
