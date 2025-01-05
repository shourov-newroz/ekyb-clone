import { IRequestMetaInfo } from '@/types/common';
import { v4 as uuidv4 } from 'uuid';

export const getMetaData = (): IRequestMetaInfo => {
  return {
    requestId: uuidv4(),
    source: 'Website',
    versionCode: '3.1.4',
    versionName: '10',
    networkType: 'Wifi/Mobile',
    deviceID: 'IMEI/DEVICE_ID/UDID',
    deviceOSCode: 27,
    deviceOSName: '8.1.0',
    deviceName: 'Galaxy Ace',
    language: 'en',
    latitude: 11.3344,
    longitude: 54.5645645,
  };
};
