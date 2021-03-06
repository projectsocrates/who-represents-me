import { Box, Button, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react';
import { Bills as _Bills, Locales } from '../../entities/bills';
import { Channel, ResultCard } from '../Components/Components';
import { useQuery } from '../Utils/useQuery';

export type BillsType = _Bills;

const getBills = async ({
  locale,
}: {
  locale: 'Chicago';
}): Promise<BillsType[]> => {
  try {
    const response = await axios.get('/bills', {
      params: { locale },
    });
    return response.data as BillsType[];
  } catch (e) {
    throw new Error(e.response.data);
  }
};

export const Bills: React.FC<{
  locale: Locales;
  bills: BillsType[];
}> = ({ locale, bills }) => {
  const { data, error, loading } = useQuery<BillsType[]>(
    () => getBills({ locale }),
    {
      defaultData: bills,
    }
  );

  if (loading) {
    return (
      <>
        <Heading as="h1" size="lg">
          Active Resolutions
        </Heading>
        <br />
        <Button isLoading loadingText="Loading" variant="outline" />
      </>
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
  if (data === null) {
    return null;
  }

  return (
    <>
      <Heading as="h1" size="lg">
        Active Resolutions
      </Heading>
      {data.map((bill) => (
        <ResultCard
          key={bill.id}
          title={bill.title}
          subtitle={bill.date}
          channels={
            <>
              <Channel type="Text" id={bill.id} />
              <Channel type="Text" id={bill.sponsor} />
              <Channel type="URL" id={bill.link} />{' '}
            </>
          }
        />
      ))}
    </>
  );
};

export const getLocale = (formattedAddress): null | Locales => {
  return formattedAddress.includes('Chicago, IL') ? 'Chicago' : null;
};
