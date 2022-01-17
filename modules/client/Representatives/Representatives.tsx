import React from 'react';

import axios from 'axios';
import { RepresentativesResult } from '../../entities/entities';

const getRepresentatives = async ({
  formattedAddress,
}: {
  formattedAddress: string;
}): Promise<RepresentativesResult> => {
  const response = await axios.get('/representatives', {
    params: { formattedAddress },
  });
  return response.data as RepresentativesResult;
};

export const Representatives: React.FC<{ formatted_address: string }> = ({
  formattedAddress,
}) => {
  const [state2, setState] = React.useState<RepresentativesResult>(null);
  const state = state2 as RepresentativesResult | null;
  React.useEffect(() => {
    getRepresentatives({ formattedAddress }).then((s) => {
      setState(s);
    });
  }, []);
  console.log(state);
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
