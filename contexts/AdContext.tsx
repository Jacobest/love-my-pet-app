import React from 'react';
import { Advertiser, Advert } from '../types';

export const AdContext = React.createContext<{
  advertisers: Advertiser[];
  adverts: Advert[];
  addAdvertiser: (advertiserData: Omit<Advertiser, 'id' | 'createdAt'>) => void;
  updateAdvertiser: (advertiserId: string, advertiserData: Partial<Advertiser>) => void;
  addAdvert: (advertData: Omit<Advert, 'id'>) => void;
  updateAdvert: (advertId: string, advertData: Partial<Advert>) => void;
}>({
  advertisers: [],
  adverts: [],
  addAdvertiser: () => {},
  updateAdvertiser: () => {},
  addAdvert: () => {},
  updateAdvert: () => {},
});

export const useAds = () => React.useContext(AdContext);