import { Heading, Text } from '@chakra-ui/react';
import {
  faFacebook,
  faTwitter,
  faWikipediaW,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faAt, faGlobe, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const ResultCard: React.FC<{
  image?: string; // todo;
  title?: string;
  subtitle?: string;
  channels: React.ReactNode;
}> = ({ title, subtitle, channels }) => {
  return (
    <div className="flex official-card">
      {/* <div className="flex-item left">
              <img src={s.official.photoUrl} />
            </div> */}
      <div className="flex-item right">
        <Heading as="h4" size="md">
          {title}
        </Heading>
        <Text fontSize="lg">{subtitle}</Text>
        <ul className="channels-container">{channels}</ul>
      </div>
    </div>
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
    case 'Text':
      return <>{channel.id} • </>;
    default:
      return (
        <>
          {channel.type}: {channel.id}
        </>
      );
  }
};
