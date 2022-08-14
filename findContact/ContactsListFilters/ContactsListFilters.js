import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
} from '@folio/stripes-acq-components';

import {
  CONTACTS_FILTERS,
  CONTACTS_STATUS_OPTIONS,
} from '../constants';
import { useCategories } from '../hooks';

export const ContactsListFilters = ({
  activeFilters,
  applyFilters,
  disabled,
}) => {
  const {
    categories,
    isLoading,
  } = useCategories();

  const adaptedApplyFilters = useCallback(({ name, values }) => applyFilters(name, values), [applyFilters]);

  const categoriesOptions = useMemo(() => (
    categories.map(({ id, value }) => ({
      value: id,
      label: value,
    }))
  ), [categories]);

  return (
    <AccordionSet>
      <AcqCheckboxFilter
        id={CONTACTS_FILTERS.status}
        disabled={disabled}
        activeFilters={activeFilters[CONTACTS_FILTERS.status]}
        labelId="ui-plugin-find-contact.contact.status"
        name={CONTACTS_FILTERS.status}
        onChange={adaptedApplyFilters}
        options={CONTACTS_STATUS_OPTIONS}
      />
      <AcqCheckboxFilter
        id={CONTACTS_FILTERS.categories}
        disabled={disabled || isLoading}
        activeFilters={activeFilters[CONTACTS_FILTERS.categories]}
        labelId="ui-plugin-find-contact.contact.categories"
        name={CONTACTS_FILTERS.categories}
        onChange={adaptedApplyFilters}
        options={categoriesOptions}
      />
    </AccordionSet>
  );
};

ContactsListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
