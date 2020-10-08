import React from 'react';
import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    label: <FormattedMessage id="ui-plugin-find-contact.contact.status" />,
    name: 'inactive',
    cql: 'inactive',
    values: [
      {
        name: 'active',
        cql: 'false',
        displayName: <FormattedMessage id="ui-plugin-find-contact.contact.status.active" />,
      },
      {
        name: 'inactive',
        cql: 'true',
        displayName: <FormattedMessage id="ui-plugin-find-contact.contact.status.inactive" />,
      },
    ],
  },
  {
    label: <FormattedMessage id="ui-plugin-find-contact.contact.categories" />,
    name: 'categories',
    cql: 'categories',
    values: [],
    operator: '=',
  },
];

export default filterConfig;
