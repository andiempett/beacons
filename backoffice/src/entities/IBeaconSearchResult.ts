export interface IBeaconSearchResult {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
  content: IBeaconSearchResultData[];
}

export interface IBeaconSearchResultData {
  id: string;
  hexId: string;
  createdDate: string;
  lastModifiedDate: string;
  beaconStatus: string;
  beaconType: string;
  ownerName: string | null;
  ownerEmail: string | null;
  accountHolderId: string | null;
  useActivities: string | null;
  cospasSarsatNumber: string | null;
  manufacturerSerialNumber: string | null;
  _links: {
    self: {
      href: string;
    };
    beaconSearchEntity: {
      href: string;
    };
  };
}
