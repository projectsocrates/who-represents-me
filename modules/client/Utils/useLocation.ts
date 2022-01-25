import React from 'react';

const parse = (location: Location) => {
  const urlSearchParams = new URLSearchParams(location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params;
};

export const useLocation = () => {
  const win =
    typeof window === 'undefined'
      ? ({ location: {}, history: {} } as Window)
      : window;
  const [location, setLocation] = React.useState(win.location);
  const [history, setHistory] = React.useState(win.history);
  const [params, setParams] = React.useState(parse(location));

  const listenToPopstate = () => {
    setLocation(window.location);
    setHistory(window.history);
    setParams(parse(window.location));
  };
  React.useEffect(() => {
    window.addEventListener('popstate', listenToPopstate);
    return () => {
      window.removeEventListener('popstate', listenToPopstate);
    };
  }, []);

  const push = ({ searchParams }: { searchParams: [string, string][] }) => {
    const url = new URL(location as unknown as URL);
    searchParams.forEach((searchParam) => {
      if (!searchParam[1]) {
        url.searchParams.delete(searchParam[0]);
      } else {
        url.searchParams.set(...searchParam);
      }
    });
    history.pushState({}, '', url);
    listenToPopstate();
  };

  return { location, history, push, params };
};

export const useSearchParam = (
  key: string,
  defaultValue?: string
): [string, (v: string) => void] => {
  const { params, push } = useLocation();

  const setValue = (value: string) => {
    push({
      searchParams: [[key, value]],
    });
  };

  const value = params[key] || defaultValue;

  return [value, setValue];
};
