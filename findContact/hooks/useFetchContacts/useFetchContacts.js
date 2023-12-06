import { useMutation } from 'react-query';
import { flatMap, uniq } from 'lodash';

import {
  useOkapiKy,
} from '@folio/stripes/core';
import {
  ASC_DIRECTION,
  batchRequest,
  buildFilterQuery,
  connectQuery,
  PLUGIN_RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';

import {
  CATEGORIES_API,
  CONTACTS_API,
  PRIVILEGED_CONTACT_URL,
} from '../../api';
import { CONTACTS_FILTERS } from '../../constants';
import { transformCategoryIdsToLabels } from '../../utils';

const SORT_MAP = {
  name: 'lastName firstName',
  status: 'inactive',
};

const buildCustomFilterQuery = filter => values => {
  const value = values.map(val => `"${val}"`).join(' or ');

  return `${filter}=(${value})`;
};

const buildCustomSortingQuery = ({ sorting, sortingDirection } = {}) => {
  if (sorting) {
    const sortIndex = (SORT_MAP[sorting] || sorting)
      .split(' ')
      .map(value => `${value}/sort.${sortingDirection || ASC_DIRECTION}`)
      .join(' ');

    return `sortby ${sortIndex}`;
  }

  return '';
};

const buildContactsQuery = searchParams => {
  const filtersQuery = buildFilterQuery(
    searchParams,
    (query) => `firstName="${query}*" or lastName="${query}*"`,
    {
      [CONTACTS_FILTERS.status]: buildCustomFilterQuery(CONTACTS_FILTERS.status),
      [CONTACTS_FILTERS.categories]: buildCustomFilterQuery(CONTACTS_FILTERS.categories),
    },
  ) || 'cql.allRecords=1';

  const sortingQuery = buildCustomSortingQuery(searchParams);

  return connectQuery(filtersQuery, sortingQuery);
};

export const useFetchContacts = ({ isPrivilegedContactEnabled = false }) => {
  const ky = useOkapiKy();

  const {
    mutateAsync: fetchContacts,
  } = useMutation({
    mutationFn: async ({
      searchParams = {},
      limit = PLUGIN_RESULT_COUNT_INCREMENT,
      offset = 0,
    }) => {
      const contactsURL = isPrivilegedContactEnabled ? PRIVILEGED_CONTACT_URL : CONTACTS_API;
      const contactsQuery = buildContactsQuery(searchParams);
      const builtSearchParams = {
        query: contactsQuery,
        limit,
        offset,
      };

      const {
        contacts = [],
        totalRecords,
      } = await ky.get(contactsURL, { searchParams: { ...builtSearchParams } }).json();

      const categoryIds = uniq(flatMap(contacts, ({ categories }) => categories));
      const categoriesResponse = await batchRequest(
        ({ params }) => ky.get(CATEGORIES_API, { searchParams: params }).json(),
        categoryIds,
      );

      return {
        contacts: contacts.map(contact => ({
          ...contact,
          categoryLabels: transformCategoryIdsToLabels(
            flatMap(categoriesResponse, ({ categories }) => categories),
            contact.categories,
          ),
        })),
        totalRecords,
      };
    },
  });

  return { fetchContacts };
};
