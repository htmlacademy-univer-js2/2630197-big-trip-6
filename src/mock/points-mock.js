import { getRandomPrice } from '../utils';

const minPrice = 240;
const maxPrice = 4100;

const pointsMock = [
  {
    'id': 'bbf2cc7a-f3e8-4609-bd4e-79d58e512287',
    'basePrice': getRandomPrice(minPrice, maxPrice),
    'dateFrom': '2025-02-13T22:06:12.821Z',
    'dateTo': '2025-02-14T15:12:12.821Z',
    'destination': 'a981d2e5-0324-475a-b814-0779833e6c23',
    'isFavorite': true,
    'offers': [
      '761e2ddb-b5cc-4590-8104-82f0643ffc06',
      'e4feb9d2-05e6-4dbe-8bec-aafde193afc0',
      '060dc342-12eb-49d9-bc4b-2ace53288cc9'
    ],
    'type': 'check-in'
  },
  {
    'id': 'c5f30a4c-0ef7-41ba-87f9-495e213a18a4',
    'basePrice': getRandomPrice(minPrice, maxPrice),
    'dateFrom': '2025-04-10T03:03:12.821Z',
    'dateTo': '2025-04-12T02:16:12.821Z',
    'destination': 'e05056ac-f5e8-413e-812e-186059ffa8b5',
    'isFavorite': false,
    'offers': [
      '201e539d-7173-4fad-82e0-788c26dfb7a9',
      '3efdd2b3-e091-459a-b4bd-c0f94005d1e1',
      '0a6f3595-450a-4d55-b917-90a1ef1af044',
      '0e7993d4-2111-41f1-b5d4-452ec166cfa5'
    ],
    'type': 'taxi'
  },
  {
    'id': '8677587e-2602-47b1-a200-d28e9cd34bce',
    'basePrice': getRandomPrice(minPrice, maxPrice),
    'dateFrom': '2025-04-07T10:38:12.821Z',
    'dateTo': '2025-04-09T10:42:12.821Z',
    'destination': 'b447fce3-6400-459e-b4ee-3a7ea0b2d620',
    'isFavorite': true,
    'offers': [],
    'type': 'sightseeing'
  },
  {
    'id': '85a2f0c4-248d-4063-ba49-011a1879c988',
    'basePrice': getRandomPrice(minPrice, maxPrice),
    'dateFrom': '2025-07-15T16:31:12.821Z',
    'dateTo': '2025-07-16T20:57:12.821Z',
    'destination': 'c404e12f-adc3-4d53-bc96-f77c333a17f9',
    'isFavorite': true,
    'offers': [],
    'type': 'taxi'
  },
  {
    'id': 'd1ef1eb1-5983-40c8-a1f3-6c039909c28c',
    'basePrice': getRandomPrice(minPrice, maxPrice),
    'dateFrom': '2025-07-30T11:46:12.821Z',
    'dateTo': '2025-07-01T23:21:12.821Z',
    'destination': 'adc0f62d-9592-467b-92d3-1882deda2ca5',
    'isFavorite': false,
    'offers': [
      '70e1751f-0a4a-4cfe-bbd1-c51289cc713d',
      '99a58311-3190-4222-94e3-b2c61e8fbe67',
      '060dc342-12eb-49d9-bc4b-2ace53288cc9'
    ],
    'type': 'check-in'
  }
];

export { pointsMock };
