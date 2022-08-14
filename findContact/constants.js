import { FormattedMessage } from 'react-intl';

export const CONTACTS_FILTERS = {
  status: 'inactive',
  categories: 'categories',
};

export const CONTACTS_STATUSES = {
  active: 'false',
  inactive: 'true',
};

export const CONTACTS_STATUS_OPTIONS = [
  {
    value: CONTACTS_STATUSES.active,
    label: <FormattedMessage id="ui-plugin-find-contact.contact.status.active" />,
  },
  {
    value: CONTACTS_STATUSES.inactive,
    label: <FormattedMessage id="ui-plugin-find-contact.contact.status.inactive" />,
  },
];
