import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import {
  faFacebook,
  faTwitter,
  faWikipediaW,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faAt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React from 'react';
import {
  OfficialOffice,
  RepresentativesResult,
} from '../../entities/representatives';
import './Representatives.css';

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

export const Representatives: React.FC<{ formattedAddress: string }> = ({
  formattedAddress,
}) => {
  const [state2, setState] = React.useState<RepresentativesResult>(null);
  const state = state2 as RepresentativesResult | null;

  const ref = React.useCallback((node: null | HTMLDivElement) => {
    if (node !== null && node.querySelector('[role=tablist]') !== null) {
      const tablist = node.querySelector('[role=tablist]') as HTMLDivElement;
      const toTop = window.pageYOffset + tablist.getBoundingClientRect().top;
      tablist.style.top = toTop.toString();
      tablist.style.position = 'sticky';
    }
  }, []);

  React.useEffect(() => {
    getRepresentatives({ formattedAddress }).then((s) => {
      setState(s);
    });
  }, [formattedAddress]);

  if (state === null) {
    return null;
  }

  return (
    <Tabs
      ref={ref}
      flex="1"
      children={
        <>
          <TabList>
            <Tab>City</Tab>
            <Tab>County</Tab>
            <Tab>State</Tab>
            <Tab>National</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <OfficialOfficeList officialOffice={state.offices['city']} />
            </TabPanel>
            <TabPanel>
              <OfficialOfficeList officialOffice={state.offices['county']} />
            </TabPanel>
            <TabPanel>
              <OfficialOfficeList officialOffice={state.offices['state']} />
            </TabPanel>
            <TabPanel>
              <OfficialOfficeList officialOffice={state.offices['national']} />
            </TabPanel>
          </TabPanels>
        </>
      }
    />
  );
};

export const OfficialOfficeList: React.FC<{
  officialOffice: OfficialOffice[];
}> = ({ officialOffice }) => {
  return (
    <>
      {officialOffice.map((s: OfficialOffice) => (
        <div
          className="flex official-card"
          key={s.office.name + s.official.name}
        >
          {/* <div className="flex-item left">
            <img src={s.official.photoUrl} />
          </div> */}
          <div className="flex-item right">
            <Heading as="h4" size="md">
              {s.office.name}
            </Heading>
            <Text fontSize="lg">{s.official.name}</Text>
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
    </>
  );
};

export const Channel: React.FC<{ id: string; type: string }> = (channel) => {
  switch (channel.type) {
    case 'Facebook':
      return (
        <a target="_blank" href={`https://facebook.com/${channel.id}`}>
          <FontAwesomeIcon icon={faFacebook} />
        </a>
      );
    case 'Twitter':
      return (
        <a target="_blank" href={`https://twitter.com/${channel.id}`}>
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      );
    case 'Email':
      return (
        <a target="_blank" href={`mailto:${channel.id}`}>
          <FontAwesomeIcon icon={faAt} />
        </a>
      );
    case 'Phone':
      return (
        <a target="_blank" href={`tel:${channel.id}`}>
          <FontAwesomeIcon icon={faPhone} />
        </a>
      );
    case 'URL':
      if (channel.id.includes('wikipedia')) {
        return (
          <a target="_blank" href={channel.id}>
            <FontAwesomeIcon icon={faWikipediaW} />
          </a>
        );
      }
      return (
        <a target="_blank" href={channel.id}>
          <FontAwesomeIcon icon={faGlobe} />
        </a>
      );
    case 'YouTube':
      return (
        <a target="_blank" href={`https://youtube.com/${channel.id}`}>
          <FontAwesomeIcon icon={faYoutube} />
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
