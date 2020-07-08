import {tuple} from './type'

/**
 * 断点划分
 */
export type TBreakpoint = 'lg' | 'md' | 'sm' | 'xs';

export type TBreakpointMap = Partial<Record<TBreakpoint, string>>;

export type ScreenMap = Partial<Record<TBreakpoint, boolean>>;

export const responsiveArray = tuple('lg' , 'md' , 'sm' , 'xs')


/**
 * 媒体查询断点映射
 * reference：https://v3.bootcss.com/css/#responsive-utilities-classes
 */
export const responsiveMap: TBreakpointMap = {
  xs: '(max-width: 767px)',
  sm: '(min-width: 768px)',
  md: '(min-width: 992px)',
  lg: '(min-width: 1200px)',
}

type SubscribeFunc = (screens: ScreenMap) => void;

class ResponsiveObserve {

  subUid: number;
  screens: ScreenMap;
  subscribers: Map<number,SubscribeFunc>;

  matchHandlers: {
    [prop: string]: {
      mql: MediaQueryList;
      listener: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;
    }
  }
  dispatch: (pointMap: ScreenMap)=> boolean;
  subscribe: (func: SubscribeFunc) => number;

  unsubscribe: (token: number) => void;

  register: () => void;

  unregister: () => void;


  constructor(){
    this.subUid = -1;
    this.screens = {};
    this.subscribers = new Map();
    this.matchHandlers = {};

    this.dispatch = (pointMap)=>{
      this.screens = pointMap;
      this.subscribers.forEach(func => func(pointMap));
      return this.subscribers.size >= 1;
    }
    this.subscribe = (func) => {
      if (!this.subscribers.size) this.register();
      this.subUid += 1;
      this.subscribers.set(this.subUid, func);
      func(this.screens);
      return this.subUid;
    }
    this.unsubscribe = (token) => {
      this.subscribers.delete(token);
      if (!this.subscribers.size) this.unregister();
    }

    this.register = () => {
      responsiveArray.forEach((screen: TBreakpoint) => {
        const matchMediaQuery = responsiveMap[screen]!;
        const listener = ({ matches }: { matches: boolean }) => {
          this.dispatch({
            ...this.screens,
            [screen]: matches,
          });
        };
        const mql = window.matchMedia(matchMediaQuery);
        mql.addListener(listener);
        this.matchHandlers[matchMediaQuery] = {
          mql,
          listener,
        };

        listener(mql);
      });
    }

    this.unregister = () => {
      responsiveArray.forEach((screen: TBreakpoint) => {
        const matchMediaQuery = responsiveMap[screen]!;
        const handler = this.matchHandlers[matchMediaQuery];
        handler?.mql.removeListener(handler?.listener);
      });
      this.subscribers.clear();
    }
  }
}

export default new ResponsiveObserve()
