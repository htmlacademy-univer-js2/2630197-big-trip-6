import { getRandomPrice } from '../utils';

const minPrice = 240;
const maxPrice = 4100;

export const pointsMock = [
  {
    'id': '27dd5201-44e4-4787-aa22-6ac3a7ca8e81',
    'basePrice': getRandomPrice(minPrice, maxPrice),
    'dateFrom': '2025-03-10T15:00:17.516Z',
    'dateTo': '2025-03-11T17:44:17.516Z',
    'destination': '28025513-9fa9-47db-8b93-78e0f32d84f1',
    'isFavorite': false,
    'offers': [
      'b7730c4f-9b4e-4c5f-ba93-3e186dca42e6',
      '9bb07f8b-e82b-4738-8b5a-5c6bae30ad90',
      '89cd5a4f-571c-410d-a4f2-1adb589dcdce',
      '1fbc49c6-2e99-488b-95bd-87739f32c533',
      '836e9bd6-d532-4867-b99a-cd339a57dc05'
    ],
    'type': 'check-in'
  },
  {
    'id': 'c8a64888-5919-471f-ad04-582058d937e8',
    'basePrice': getRandomPrice(minPrice, maxPrice),
    'dateFrom': '2025-04-13T02:00:17.516Z',
    'dateTo': '2025-04-14T10:29:17.516Z',
    'destination': '13b3f63e-494e-4736-93d6-eea350805f32',
    'isFavorite': false,
    'offers': [],
    'type': 'sightseeing'
  },
  {
    'id': '4a2f4727-4518-4f0d-ba31-be9b113c2c1b',
    'basePrice': getRandomPrice(minPrice, maxPrice),
    'dateFrom': '2025-05-14T23:12:17.516Z',
    'dateTo': '2025-05-15T10:49:17.516Z',
    'destination': 'b029dbd0-e23d-40be-9aa2-97828f51b5bb',
    'isFavorite': true,
    'offers': [
      '48f5964e-267d-4b41-804e-ffc531ebd023'
    ],
    'type': 'drive'
  },
  {
    'id': '1159737c-4403-4ee7-bd1b-e40f38eb0005',
    'basePrice': getRandomPrice(minPrice, maxPrice),
    'dateFrom': '2025-06-15T17:25:17.516Z',
    'dateTo': '2025-06-17T10:45:17.516Z',
    'destination': '5ad946fb-2d23-46e9-af7e-d272c642aecf',
    'isFavorite': false,
    'offers': [
      '7c242e33-9390-4f28-84ed-bf352809944a',
      '8fcead10-05f2-440a-9fb8-fd1b6389dc98',
      'bf082dcc-2af6-470d-a049-26a746d244dd',
      '9289150c-b8c2-44a0-bc44-94f5cd8e7894',
      'bef15b9f-e8a2-409c-85ac-92bdaf461759'
    ],
    'type': 'ship'
  },
  {
    'id': '127142a6-cfda-4b08-98df-e700684edada',
    'basePrice': getRandomPrice(minPrice, maxPrice),
    'dateFrom': '2025-07-18T03:18:17.516Z',
    'dateTo': '2025-07-18T16:32:17.516Z',
    'destination': 'b029dbd0-e23d-40be-9aa2-97828f51b5bb',
    'isFavorite': false,
    'offers': [
      '4fb723a2-cf55-421a-b77b-b3317e2463ca',
      '429b80d4-0961-4511-a8c8-689252e6efe0'
    ],
    'type': 'restaurant'
  }
];
