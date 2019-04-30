import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get, noop } from 'lodash';

import { SearchAndSort, makeQueryFunction } from '@folio/stripes/smart-components';
import {
  Modal,
  Button,
  Icon,
} from '@folio/stripes/components';
import { transformCategoryIdsToLables } from '@folio/organizations/src/common/utils/category';
import { categoriesResource } from '@folio/organizations/src/common/resources';
import { CONTACTS_API } from '@folio/organizations/src/common/constants';

import packageInfo from '../package';
import css from './FindContactModal.css';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const filterConfig = [];
const visibleColumns = ['status', 'name', 'categories'];
const columnMapping = {
  status: <FormattedMessage id="ui-plugin-find-contact.list.status" />,
  name: <FormattedMessage id="ui-plugin-find-contact.list.name" />,
  categories: <FormattedMessage id="ui-plugin-find-contact.list.categories" />,
};

class FindContactModal extends React.Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: ''
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

  closeModal = () => {
    this.props.closeCB();
  }

  onSelectRow = (e, contact) => {
    this.props.addContacts([contact]);
    this.closeModal();
  }

  render() {
    const { resources, mutator, stripes } = this.props;

    const resultsFormatter = {
      status: data => (
        <FormattedMessage id={`ui-plugin-find-contact.list.status.${get(data, 'inactive', false) ? 'inactive' : 'active'}`} />
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
      <Fragment>
        <Button
          marginBottom0
          onClick={this.closeModal}
        >
          <FormattedMessage id="ui-plugin-find-contact.button.close" />
        </Button>
      </Fragment>
    );

    return (
      <Modal
        data-test-find-contact-modal
        dismissible
        footer={footer}
        label=""
        onClose={this.closeModal}
        open
        contentClass={css.findContactModalContent}
        style={{ minHeight: '500px' }}
        size="large"
      >
        {
          get(resources, 'categories.isPending', true) ? (
            <Icon icon="spinner-ellipsis" />
          ) : (
            <SearchAndSort
              packageInfo={this.props.packageInfo || packageInfo}
              objectName="contact"
              visibleColumns={visibleColumns}
              columnMapping={columnMapping}
              resultsFormatter={resultsFormatter}
              initialResultCount={INITIAL_RESULT_COUNT}
              resultCountIncrement={RESULT_COUNT_INCREMENT}
              parentResources={resources}
              parentMutator={mutator}
              filterConfig={filterConfig}
              stripes={stripes}
              viewRecordComponent={noop}
              disableRecordCreation
              browseOnly
              showSingleResult
              onSelectRow={this.onSelectRow}
              viewRecordPerms=""
            />
          )
        }
      </Modal>
    );
  }
}

FindContactModal.propTypes = {
  packageInfo:  PropTypes.object,
  stripes:  PropTypes.object.isRequired,
  mutator:  PropTypes.object.isRequired,
  resources:  PropTypes.object.isRequired,
  closeCB: PropTypes.func.isRequired,
  addContacts: PropTypes.func.isRequired,
};

export default FindContactModal;
