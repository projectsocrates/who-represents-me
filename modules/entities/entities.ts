export interface RepresentativesResult {
  normalizedInput: GoogleRepresentativesResponse['normalizedInput'];
  divisions: GoogleRepresentativesResponse['divisions'];
  offices: Array<{ office: Office; official: Official }>;
}

export interface Office {
  name: string;
  divisionId: string;
  levels: [string];
  roles: [string];
  sources: [
    {
      name: string;
      official: boolean;
    }
  ];
  officialIndices: [number];
}

export interface Official {
  name: string;
  address: [
    {
      locationName: string;
      line1: string;
      line2: string;
      line3: string;
      city: string;
      state: string;
      zip: string;
    }
  ];
  party: string;
  phones: [string];
  urls: [string];
  photoUrl: string;
  emails: [string];
  channels: [
    {
      type: string;
      id: string;
    }
  ];
}

export interface GoogleRepresentativesResponse {
  kind: 'civicinfo#representativeInfoResponse';
  normalizedInput: {
    locationName: string;
    line1: string;
    line2: string;
    line3: string;
    city: string;
    state: string;
    zip: string;
  };
  divisions: {
    [key: string]: {
      name: string;
      alsoKnownAs: [string];
      officeIndices: [number];
    };
  };
  offices: [Office];
  officials: [Official];
}
