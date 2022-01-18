import React from 'react';

import axios from 'axios';
import {
  OfficialOffice,
  RepresentativesResult,
} from '../../entities/representatives';
import './Representatives.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  faPaperPlane,
  faPhone,
  faPaperclip,
} from '@fortawesome/free-solid-svg-icons';

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
      {Object.keys(state.offices).map((level) => {
        return (
          <div key={level}>
            <h2>{level}</h2>
            {state.offices[level].map((s: OfficialOffice) => (
              <div
                className="flex official-card"
                key={s.office.name + s.official.name}
              >
                <div className="flex-item left">
                  <img src={s.official.photoUrl} />
                </div>
                <div className="flex-item right">
                  <div className="office-name">{s.office.name}</div>
                  <div className="official-name">{s.official.name}</div>
                  <ul className="channels-container">
                    {s.official.channels?.map((channel) => {
                      return (
                        <li key={channel.type + channel.id}>
                          <Channel {...channel} />
                        </li>
                      );
                    })}
                    {s.official.phones?.map((id) => (
                      <li key={id}>
                        <Channel type="Phone" id={id} />
                      </li>
                    ))}
                    {s.official.emails?.map((id) => (
                      <li key={id}>
                        <Channel type="Email" id={id} />
                      </li>
                    ))}
                    {s.official.urls?.map((id) => (
                      <li key={id}>
                        <Channel type="URL" id={id} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};

export const Channel: React.FC<{ id: string; type: string }> = (channel) => {
  switch (channel.type) {
    case 'Facebook':
      return (
        <a href={`https://facebook.com/${channel.id}`}>
          <FontAwesomeIcon icon={faFacebook} />
        </a>
      );
    case 'Twitter':
      return (
        <a href={`https://twitter.com/${channel.id}`}>
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      );
    case 'Email':
      return (
        <a href={`mailto:${channel.id}`}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </a>
      );
    case 'Phone':
      return (
        <a href={`tel:${channel.id}`}>
          <FontAwesomeIcon icon={faPhone} />
        </a>
      );
    case 'URL':
      return (
        <a href={channel.id}>
          <FontAwesomeIcon icon={faPaperclip} />
        </a>
      );
    default:
      return (
        <>
          {channel.type}: {channel.id}
        </>
      );
  }
};
