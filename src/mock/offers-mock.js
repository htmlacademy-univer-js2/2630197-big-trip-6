import { getRandomPrice } from '../utils';

const minPrice = 40;
const maxPrice = 180;

const offersMock = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': '201e539d-7173-4fad-82e0-788c26dfb7a9',
        'title': 'Choose the radio station',
        'price': getRandomPrice(minPrice, maxPrice)
      },
      {
        'id': '3efdd2b3-e091-459a-b4bd-c0f94005d1e1',
        'title': 'Choose temperature',
        'price': getRandomPrice(minPrice, maxPrice)
      },
      {
        'id': '0a6f3595-450a-4d55-b917-90a1ef1af044',
        'title': 'Drive quickly, I\'m in a hurry',
        'price': getRandomPrice(minPrice, maxPrice)
      },
      {
        'id': '0e7993d4-2111-41f1-b5d4-452ec166cfa5',
        'title': 'Drive slowly',
        'price': getRandomPrice(minPrice, maxPrice)
      }
    ]
  },
  {
    'type': 'check-in',
    'offers': [
      {
        'id': '761e2ddb-b5cc-4590-8104-82f0643ffc06',
        'title': 'Choose the time of check-in',
        'price': getRandomPrice(minPrice, maxPrice)
      },
      {
        'id': 'e4feb9d2-05e6-4dbe-8bec-aafde193afc0',
        'title': 'Choose the time of check-out',
        'price': getRandomPrice(minPrice, maxPrice)
      },
      {
        'id': '70e1751f-0a4a-4cfe-bbd1-c51289cc713d',
        'title': 'Add breakfast',
        'price': getRandomPrice(minPrice, maxPrice)
      },
      {
        'id': '99a58311-3190-4222-94e3-b2c61e8fbe67',
        'title': 'Laundry',
        'price': getRandomPrice(minPrice, maxPrice)
      },
      {
        'id': '060dc342-12eb-49d9-bc4b-2ace53288cc9',
        'title': 'Order a meal from the restaurant',
        'price': getRandomPrice(minPrice, maxPrice)
      }
    ]
  },
  {
    'type': 'sightseeing',
    'offers': []
  }
];

export { offersMock };
