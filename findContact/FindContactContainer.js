import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import { transformCategoryIdsToLables } from '@folio/organizations/src/common/utils/category';
import { categoriesResource } from '@folio/organizations/src/common/resources';
import { CONTACTS_API } from '@folio/organizations/src/common/constants';

import filterConfig from './filterConfig';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const columnWidths = {
  isChecked: '8%',
  status: '20%',
  name: '32%',
  categories: '40%',
};
const visibleColumns = ['status', 'name', 'categories'];
const columnMapping = {
  status: <FormattedMessage id="ui-plugin-find-contact.contact.status" />,
  name: <FormattedMessage id="ui-plugin-find-contact.contact.name" />,
  categories: <FormattedMessage id="ui-plugin-find-contact.contact.categories" />,
};
const idPrefix = 'uiPluginFindContacts-';
const modalLabel = <FormattedMessage id="ui-plugin-find-contact.modal.title" />;

class FindContactContainer extends React.Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        filters: '',
      },
    },
    records: {
      throwErrors: false,
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
            '(firstName="%{query.query}*" or lastName="%{query.query}*")',
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

  constructor(props, context) {
    super(props, context);

    this.logger = props.stripes.logger;
    this.log = this.logger.log.bind(this.logger);
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger);
    this.props.mutator.query.replace('');
  }

  componentDidUpdate() {
    const { mutator, resources } = this.props;
    const categories = get(resources, 'categories.records') || [];

    if (categories.length) {
      const catFilterConfig = filterConfig.find(group => group.name === 'categories');
      const oldValuesLength = catFilterConfig.values.length;

      catFilterConfig.values = categories.map(rec => ({ name: rec.value, cql: rec.id }));
      if (oldValuesLength === 0) {
        mutator.initializedFilterConfig.replace(true); // triggers refresh of contacts
      }
    }

    this.source.update(this.props);
  }

  onNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  querySetter = ({ nsValues, state }) => {
    if (/reset/.test(state.changeType)) {
      this.props.mutator.query.replace(nsValues);
    } else {
      this.props.mutator.query.update(nsValues);
    }
  }

  queryGetter = () => {
    return get(this.props.resources, 'query', {});
  }

  render() {
    const {
      resources,
      children,
    } = this.props;

    const users = get(resources, 'records.records', []);
    const records = users.map(user => ({
      ...user,
      categories: transformCategoryIdsToLables(
        get(resources, 'categories.records', []),
        get(user, 'categories', []),
      ),
    }));

    const resultsFormatter = {
      status: data => (
        <FormattedMessage id={`ui-plugin-find-contact.contact.status.${get(data, 'inactive', false) ? 'inactive' : 'active'}`} />
      ),
      name: data => `${get(data, 'lastName', '')}, ${get(data, 'firstName', '')}`,
    };

    if (this.source) {
      this.source.update(this.props);
    }

    return children({
      columnMapping,
      columnWidths,
      filterConfig,
      idPrefix,
      modalLabel,
      onNeedMoreData: this.onNeedMoreData,
      queryGetter: this.queryGetter,
      querySetter: this.querySetter,
      resultsFormatter,
      source: this.source,
      visibleColumns,
      data: {
        records
      },
    });
  }
}

FindContactContainer.propTypes = {
  stripes: PropTypes.object.isRequired,
  children: PropTypes.func,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FindContactContainer, { dataKey: 'find_contact' });
