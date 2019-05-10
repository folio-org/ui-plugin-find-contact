import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import { FILTERS } from './constants';

const STATUS_FILTER_OPTIONS = [
  {
    label: <FormattedMessage id="ui-plugin-find-contact.contact.status.active" />,
    value: 'false',
  },
  {
    label: <FormattedMessage id="ui-plugin-find-contact.contact.status.inactive" />,
    value: 'true',
  },
];

class FindContactFilters extends Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    activeFilters: {
      inactive: [],
    },
    categories: [],
  };

  createClearFilterHandler = (name) => () => {
    this.props.onChange({ name, values: [] });
  }

  renderCheckboxFilter = (name, labelId, options) => {
    const activeFilters = this.props.activeFilters[name] || [];

    return (
      <Accordion
        displayClearButton={activeFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id={labelId} />}
        onClearFilter={this.createClearFilterHandler(FILTERS.STATUS)}
      >
        <CheckboxFilter
          dataOptions={options}
          name={name}
          onChange={this.props.onChange}
          selectedValues={activeFilters}
        />
      </Accordion>
    );
  }

  onChangeCategoryFilter = category => this.props.onChange({ name: FILTERS.CATEGORY, values: [category] });

  renderCategoryFilter = () => {
    const dataOptions = this.props.categories.map(category => ({
      value: category.id,
      label: category.value,
    }));

    const activeFilters = this.props.activeFilters.categories || [];

    return (
      <Accordion
        displayClearButton={activeFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-plugin-find-contact.contact.categories" />}
        onClearFilter={this.createClearFilterHandler(FILTERS.CATEGORY)}
      >
        <Selection
          dataOptions={dataOptions}
          value={activeFilters[0] || ''}
          onChange={this.onChangeCategoryFilter}
        />
      </Accordion>
    );
  }

  render() {
    return (
      <AccordionSet>
        {this.renderCheckboxFilter('inactive', 'ui-plugin-find-contact.contact.status', STATUS_FILTER_OPTIONS)}
        {this.renderCategoryFilter()}
      </AccordionSet>
    );
  }
}

export default FindContactFilters;
