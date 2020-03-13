import {
  baseManifest,
} from '@folio/stripes-acq-components';

import { CATEGORIES_API } from './api';

// eslint-disable-next-line import/prefer-default-export
export const categoriesResource = {
  ...baseManifest,
  records: 'categories',
  path: CATEGORIES_API,
};
