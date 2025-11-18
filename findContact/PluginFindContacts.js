import get from 'lodash/get';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  FindRecords,
  PLUGIN_RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';

import { ContactsListFilters } from './ContactsListFilters/ContactsListFilters';
import { useFetchContacts } from './hooks';

const idPrefix = 'uiPluginFindContacts-';
const modalLabel = <FormattedMessage id="ui-plugin-find-contact.modal.title" />;
const resultsPaneTitle = <FormattedMessage id="ui-plugin-find-contact.meta.pluginTitle" />;

const columnWidths = {
  isChecked: '8%',
  status: '20%',
  name: '32%',
  categories: '40%',
};
const visibleColumns = ['status', 'name', 'categories'];
const sortableColumns = ['status', 'name', 'categories'];
const resultsFormatter = {
  status: data => (
    <FormattedMessage
      id={`ui-plugin-find-contact.contact.status.${data.inactive ? 'inactive' : 'active'}`}
    />
  ),
  name: data => `${get(data, 'lastName', '')}, ${get(data, 'firstName', '')}`,
  categories: data => data.categoryLabels,
};
const columnMapping = {
  status: <FormattedMessage id="ui-plugin-find-contact.contact.status" />,
  name: <FormattedMessage id="ui-plugin-find-contact.contact.name" />,
  categories: <FormattedMessage id="ui-plugin-find-contact.contact.categories" />,
};

const INIT_PAGINATION = { limit: PLUGIN_RESULT_COUNT_INCREMENT, offset: 0 };

const PluginFindContacts = ({
  addContacts = noop,
  disabled = false,
  isMultiSelect = true,
  isPrivilegedContactEnabled = false,
  renderNewContactBtn = noop,
  searchLabel = <FormattedMessage id="ui-plugin-find-contact.button.addContact" />,
  ...rest
}) => {
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(INIT_PAGINATION);

  const { fetchContacts } = useFetchContacts({ isPrivilegedContactEnabled });

  const refreshRecords = useCallback((filters) => {
    setIsLoading(true);

    setRecords([]);
    setTotalCount(0);
    setPagination(INIT_PAGINATION);
    setSearchParams(filters);

    fetchContacts({ ...INIT_PAGINATION, searchParams: filters })
      .then(({ contacts, totalRecords }) => {
        setTotalCount(totalRecords);
        setRecords(contacts);
      })
      .finally(() => setIsLoading(false));
  }, [fetchContacts]);

  const onNeedMoreData = useCallback((newPagination) => {
    setIsLoading(true);

    fetchContacts({ ...newPagination, searchParams })
      .then(({ contacts }) => {
        setPagination(newPagination);
        setRecords(contacts);
      })
      .finally(() => setIsLoading(false));
  }, [fetchContacts, searchParams]);

  const renderFilters = useCallback((activeFilters, applyFilters) => {
    return (
      <ContactsListFilters
        activeFilters={activeFilters}
        applyFilters={applyFilters}
        disabled={isLoading}
      />
    );
  }, [isLoading]);

  return (
    <FindRecords
      {...rest}
      columnMapping={columnMapping}
      columnWidths={columnWidths}
      disabled={disabled}
      idPrefix={idPrefix}
      isLoading={isLoading}
      isMultiSelect={isMultiSelect}
      modalLabel={modalLabel}
      onNeedMoreData={onNeedMoreData}
      pagination={pagination}
      records={records}
      refreshRecords={refreshRecords}
      renderFilters={renderFilters}
      renderNewBtn={renderNewContactBtn}
      resultsFormatter={resultsFormatter}
      resultsPaneTitle={resultsPaneTitle}
      searchLabel={searchLabel}
      selectRecords={addContacts}
      sortableColumns={sortableColumns}
      totalCount={totalCount}
      visibleColumns={visibleColumns}
    />
  );
};

PluginFindContacts.propTypes = {
  disabled: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  addContacts: PropTypes.func,
  renderNewContactBtn: PropTypes.func,
  isMultiSelect: PropTypes.bool,
  isPrivilegedContactEnabled: PropTypes.bool,
};

export default PluginFindContacts;
