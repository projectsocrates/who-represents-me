import {
  Box,
  Button,
  Container,
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
import { Bills, BillsType, getLocale } from '../Bills/Bills';
import { Channel, ResultCard } from '../Components/Components';
import { useSearchParam } from '../Utils/useLocation';
import { useQuery } from '../Utils/useQuery';
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

  const {
    data: state,
    loading,
    error,
  } = useQuery<RepresentativesResult>(
    () => getRepresentatives({ formattedAddress }),
    {
      defaultData: representatives,
    }
  );

  const ref = React.useCallback((node: null | HTMLDivElement) => {
    if (node !== null && node.querySelector('[role=tablist]') !== null) {
      const tablist = node.querySelector('[role=tablist]') as HTMLDivElement;
      const toTop = window.pageYOffset + tablist.getBoundingClientRect().top;
      tablist.style.top = toTop.toString();
      tablist.style.position = 'sticky';
    }
  }, []);

  const heading = (
    <Heading as="h1" size="lg">
      Your Representatives
    </Heading>
  );

  if (loading) {
    return (
      <Container display="flex" padding={2} justifyContent={'center'}>
        <Button isLoading loadingText="Loading" variant="outline" />
      </Container>
    );
  }
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
              <Container maxW="container.lg" padding="0">
                <SimpleGrid columns={2} spacing={5} minChildWidth="200px">
                  <Container display="flex" flexDir={'column'} padding="0">
                    {level === 'city' && locale ? (
                      <Bills locale={locale} bills={bills} />
                    ) : null}
                  </Container>
                  <Container display="flex" flexDir={'column'} padding="0">
                    {heading}
                    <OfficialOfficeList officialOffice={state.offices[level]} />
                  </Container>
                </SimpleGrid>
              </Container>
            ) : (
              <Container padding="0">
                {heading}
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
