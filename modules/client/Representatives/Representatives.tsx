import React from 'react';

import axios from 'axios';

interface RepResult {
  offices: Array<{ office: { name: string }; official: { name: string } }>;
}

const getRepresentatives = async ({
  formattedAddress,
}: {
  formattedAddress: string;
}): Promise<RepResult> => {
  const response = await axios.get('/representatives', {
    params: { formattedAddress },
  });
  return response.data as RepResult;
};

export const Representatives: React.FC<{ formatted_address: string }> = ({
  formattedAddress,
}) => {
  const [state2, setState] = React.useState<RepResult>(null);
  const state = state2 as RepResult | null;
  React.useEffect(() => {
    getRepresentatives({ formattedAddress }).then((s) => {
      setState(s);
    });
  }, []);

  if (state === null) {
    return null;
  }

  return (
    <>
      {state.offices.map((s) => {
        return (
          <div key={s.office.name}>
            {s.office.name}: {s.official.name}
          </div>
        );
      })}
    </>
  );
};
