import React from 'react';
import { Box, Text, Heading, Container } from '@chakra-ui/react';

export const Instructions = () => {
  return (
    <Box mt="2" padding="4" margin="0" bg="gray.100" width="100%">
      <Heading as="h2" size="md">
        Find Your Representatives
      </Heading>
      <Text>Use this site to find information about your representatives.</Text>
    </Box>
  );
};
