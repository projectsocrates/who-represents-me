import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';

import axios from 'axios';
import React from 'react';
import { REP_LEVEL_SEARCH_KEY } from '../../config';
import {
  OfficialOffice,
  RepresentativesResult,
} from '../../entities/representatives';
import { Bills, getLocale, BillsType } from '../Bills/Bills';
import { Channel, ResultCard } from '../Components/Components';
import { useSearchParam } from '../Utils/useLocation';
import './Representatives.css';

const getRepresentatives = async ({
  formattedAddress,
}: {
  formattedAddress: string;
}): Promise<RepresentativesResult> => {
  try {
    const response = await axios.get('/representatives', {
      params: { formattedAddress },
    });
    return response.data as RepresentativesResult;
  } catch (e) {
    throw new Error(e.response.data);
  }
};

export const Representatives: React.FC<{
  formattedAddress: string;
  representatives?: RepresentativesResult;
  bills?: BillsType[];
  defaultRepLevel?: string;
}> = ({ formattedAddress, representatives, defaultRepLevel, bills }) => {
  const repLevels = ['city', 'county', 'state', 'national'];

  const [repLevel, setRepLevel] = useSearchParam(
    REP_LEVEL_SEARCH_KEY,
    defaultRepLevel || repLevels[0]
  );

  const [state, setState] = React.useState<RepresentativesResult>(
    representatives || null
  );
  const [error, setError] = React.useState<Error | null>(null);

  const ref = React.useCallback((node: null | HTMLDivElement) => {
    if (node !== null && node.querySelector('[role=tablist]') !== null) {
      const tablist = node.querySelector('[role=tablist]') as HTMLDivElement;
      const toTop = window.pageYOffset + tablist.getBoundingClientRect().top;
      tablist.style.top = toTop.toString();
      tablist.style.position = 'sticky';
    }
  }, []);

  React.useEffect(() => {
    getRepresentatives({ formattedAddress })
      .then((s) => {
        setState(s);
        setRepLevel(repLevels[repLevels.indexOf(repLevel) || 0]);
      })
      .catch((e) => {
        console.error(e);
        setError(e);
      });
  }, [formattedAddress]);

  if (error) {
    return (
      <Box>
        <Heading>Something Went Wrong</Heading>
        <Text>{error.message}</Text>
      </Box>
    );
  }
  if (state === null) {
    return null;
  }
  const locale = getLocale(formattedAddress);
  return (
    <Tabs
      ref={ref}
      flex="1"
      onChange={(i) => {
        setRepLevel(repLevels[i]);
      }}
      index={repLevels.indexOf(repLevel)}
    >
      <TabList>
        {repLevels.map((level) => (
          // className is for server side rendering to have styles same as aria-selected
          <Tab key={level} className={repLevel === level && 'is-selected-tab'}>
            {level}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {repLevels.map((level) => (
          <TabPanel key={level}>
            {level === 'city' && locale ? (
              <Container maxW="container.lg">
                <SimpleGrid columns={2} spacing={5} minChildWidth="200px">
                  <Container display="flex" flexDir={'column'}>
                    {level === 'city' && locale ? (
                      <Bills locale={locale} bills={bills} />
                    ) : null}
                  </Container>
                  <Container display="flex" flexDir={'column'}>
                    <Heading as="h1" size="lg">
                      Your Representatives
                    </Heading>
                    <OfficialOfficeList officialOffice={state.offices[level]} />
                  </Container>
                </SimpleGrid>
              </Container>
            ) : (
              <Container>
                <Heading as="h1" size="lg">
                  Your Representatives
                </Heading>
                <OfficialOfficeList officialOffice={state.offices[level]} />
              </Container>
            )}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export const OfficialOfficeList: React.FC<{
  officialOffice: OfficialOffice[];
}> = ({ officialOffice }) => {
  return (
    <>
      {officialOffice.map((s: OfficialOffice) => (
        <ResultCard
          key={s.office.name + s.official.name}
          title={s.office.name}
          subtitle={s.official.name}
          channels={
            <>
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
            </>
          }
        />
      ))}
    </>
  );
};
