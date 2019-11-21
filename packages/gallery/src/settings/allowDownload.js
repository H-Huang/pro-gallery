import { INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Toggle Download',
  description: 'Add a download icon to each item',
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}