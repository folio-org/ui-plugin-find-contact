import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  get,
  noop,
  pickBy,
} from 'lodash';

import {
  SearchAndSort,
  makeQueryFunction,
} from '@folio/stripes/smart-components';
import {
  Button,
  Checkbox,
  Icon,
  Modal,
} from '@folio/stripes/components';
import { transformCategoryIdsToLables } from '@folio/organizations/src/common/utils/category';
import { categoriesResource } from '@folio/organizations/src/common/resources';
import { CONTACTS_API } from '@folio/organizations/src/common/constants';

import packageInfo from '../package';
import { FILTERS } from './constants';
import FindContactFilters from './FindContactFilters';
import css from './FindContactModal.css';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const reduceContactsToMap = (contacts, isChecked = false) => {
  const contactReducer = (accumulator, contact) => {
    accumulator[contact.id] = isChecked ? contact : null;

    return accumulator;
  };

  return contacts.reduce(contactReducer, {});
};

const filterConfig = [
  {
    name: FILTERS.STATUS,
    cql: FILTERS.STATUS,
    values: [],
  },
  {
    name: FILTERS.CATEGORY,
    cql: FILTERS.CATEGORY,
    values: [],
  },
];

const visibleColumns = ['isChecked', 'status', 'name', 'categories'];
const columnWidths = {
  isChecked: '8%',
  status: '17%',
  name: '25%',
  categories: '50%',
};

class FindContactModal extends React.Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
      },
    },
    records: {
      type: 'okapi',
      records: 'contacts',
      path: CONTACTS_API,
      clear: true,
      recordsRequired: '%{resultCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(firstName="*%{query.query}*" or lastName="*%{query.query}*")',
            {},
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    categories: categoriesResource,
  });

  state = {
    checkedContactsMap: {},
    isAllChecked: false,
  }

  closeModal = () => {
    this.props.closeCB();
  }

  onSelectRow = (e, contact) => {
    this.toggleItem(contact);
  }

  getActiveFilters = () => {
    const { query } = this.props.resources;

    if (!query || !query.filters) return {};

    return query.filters
      .split(',')
      .reduce((filterMap, currentFilter) => {
        const [name, value] = currentFilter.split('.');

        if (!Array.isArray(filterMap[name])) {
          filterMap[name] = [];
        }

        filterMap[name].push(value);

        return filterMap;
      }, {});
  }

  handleFilterChange = ({ name, values }) => {
    const newFilters = {
      ...this.getActiveFilters(),
      [name]: values,
    };

    const filters = Object.keys(newFilters)
      .map((filterName) => {
        return newFilters[filterName]
          .map((filterValue) => `${filterName}.${filterValue}`)
          .join(',');
      })
      .filter(filter => filter)
      .join(',');

    this.props.mutator.query.update({ filters });
  }

  renderFilters = (onChange) => {
    const { resources } = this.props;

    return (
      <FindContactFilters
        activeFilters={this.getActiveFilters()}
        onChange={onChange}
        categories={get(resources, 'categories.records', [])}
      />
    );
  }

  save = () => {
    const contactList = Object.values(pickBy(this.state.checkedContactsMap));

    this.props.addContacts(contactList);
    this.closeModal();
  }

  toggleItem = (contact) => {
    const { id } = contact;

    this.setState(({ checkedContactsMap }) => {
      const newContact = checkedContactsMap[id] ? null : contact;

      return {
        checkedContactsMap: {
          ...checkedContactsMap,
          [id]: newContact,
        },
        isAllChecked: false,
      };
    });
  }

  toggleAll = () => {
    this.setState((state, props) => {
      const isAllChecked = !state.isAllChecked;
      const contacts = get(props.resources, 'records.records', []);
      const checkedContactsMap = reduceContactsToMap(contacts, isAllChecked);

      return {
        checkedContactsMap,
        isAllChecked,
      };
    });
  }

  render() {
    const { resources, mutator, stripes, renderNewContactBtn } = this.props;
    const { checkedContactsMap, isAllChecked } = this.state;
    const checkedContactsListLength = Object.values(pickBy(checkedContactsMap)).length;
    const columnMapping = {
      isChecked: (
        <Checkbox
          checked={isAllChecked}
          onChange={this.toggleAll}
          type="checkbox"
        />
      ),
      status: <FormattedMessage id="ui-plugin-find-contact.contact.status" />,
      name: <FormattedMessage id="ui-plugin-find-contact.contact.name" />,
      categories: <FormattedMessage id="ui-plugin-find-contact.contact.categories" />,
    };
    const resultsFormatter = {
      isChecked: data => (
        <Checkbox
          type="checkbox"
          checked={Boolean(checkedContactsMap[data.id])}
        />
      ),
      status: data => (
        <FormattedMessage id={`ui-plugin-find-contact.contact.status.${get(data, 'inactive', false) ? 'inactive' : 'active'}`} />
      ),
      name: data => `${get(data, 'lastName', '')}, ${get(data, 'firstName', '')}`,
      categories: data => (
        transformCategoryIdsToLables(
          get(resources, 'categories.records', []),
          get(data, 'categories', []),
        )
      ),
    };

    const footer = (
      <div className={css.footer}>
        <Button
          marginBottom0
          onClick={this.closeModal}
          className="left"
        >
          <FormattedMessage id="ui-plugin-find-contact.button.cancel" />
        </Button>
        <div>
          <FormattedMessage
            id="ui-plugin-find-contact.totalSelected"
            values={{ count: checkedContactsListLength }}
          />
        </div>
        <Button
          marginBottom0
          onClick={this.save}
          disabled={!checkedContactsListLength}
          buttonStyle="primary"
        >
          <FormattedMessage id="ui-plugin-find-contact.button.save" />
        </Button>
      </div>
    );

    return (
      <Modal
        contentClass={css.findContactModalContent}
        data-test-find-contact-modal
        dismissible
        enforceFocus={false}
        footer={footer}
        label={<FormattedMessage id="ui-plugin-find-contact.modal.title" />}
        onClose={this.closeModal}
        open
        size="large"
        style={{ minHeight: '500px' }}
      >
        {
          get(resources, 'categories.isPending', true) ? (
            <Icon icon="spinner-ellipsis" />
          ) : (
            <Fragment>
              <div className={css.findContactModalNewBtnWrapper}>
                {renderNewContactBtn()}
              </div>
              <SearchAndSort
                browseOnly
                columnMapping={columnMapping}
                columnWidths={columnWidths}
                disableRecordCreation
                initialResultCount={INITIAL_RESULT_COUNT}
                objectName="contact"
                onFilterChange={this.handleFilterChange}
                onSelectRow={this.onSelectRow}
                packageInfo={this.props.packageInfo || packageInfo}
                parentMutator={mutator}
                parentResources={resources}
                renderFilters={this.renderFilters}
                resultCountIncrement={RESULT_COUNT_INCREMENT}
                resultsFormatter={resultsFormatter}
                showSingleResult
                stripes={stripes}
                viewRecordComponent={noop}
                viewRecordPerms=""
                visibleColumns={visibleColumns}
              />
            </Fragment>
          )
        }
      </Modal>
    );
  }
}

FindContactModal.propTypes = {
  addContacts: PropTypes.func.isRequired,
  closeCB: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
  packageInfo: PropTypes.object,
  renderNewContactBtn: PropTypes.func,
};

FindContactModal.defaultProps = {
  renderNewContactBtn: noop,
};

export default FindContactModal;
