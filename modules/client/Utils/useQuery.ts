import React from 'react';

export const useQuery = <T extends unknown>(
  asyncFunc: () => Promise<any>,
  { defaultData }
): { data: T; error: any; loading: boolean } => {
  const [data, setData] = React.useState(defaultData || null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    asyncFunc()
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, []);

  return { data, error, loading };
};
