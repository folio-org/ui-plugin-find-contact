import React from 'react';
import PropTypes from 'prop-types';
import { Button, omitProps } from '@folio/stripes/components';
import className from 'classnames';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

import FindContactModal from './FindContactModal';

import css from './FindContactContainer.css';

class FindContactContainer extends React.Component {
  constructor(props) {
    super(props);

    this.connectedFindContactModal = props.stripes.connect(FindContactModal, { dataKey: this.props.dataKey });
  }

  state = {
    openModal: false,
  }

  getStyle() {
    const { marginTop0 } = this.props;

    return className(
      css.searchControl,
      { [css.marginTop0]: marginTop0 },
    );
  }

  openModal = () => this.setState({
    openModal: true,
  });

  closeModal = () => this.setState({
    openModal: false,
  });

  render() {
    const { disabled, searchButtonStyle, searchLabel, marginBottom0 } = this.props;
    const props = omitProps(this.props, ['disabled', 'searchButtonStyle', 'searchLabel', 'marginBottom0', 'marginTop0']);

    return (
      <div className={this.getStyle()}>
        <Button
          data-test-plugin-find-contact-button
          buttonStyle={searchButtonStyle}
          data-test-add-contact
          disabled={disabled}
          key="searchButton"
          marginBottom0={marginBottom0}
          onClick={this.openModal}
          tabIndex="-1"
        >
          {searchLabel}
        </Button>
        {this.state.openModal && (
          <this.connectedFindContactModal
            closeCB={this.closeModal}
            {...props}
          />
        )}
      </div>
    );
  }
}

FindContactContainer.defaultProps = {
  disabled: false,
  marginBottom0: true,
  marginTop0: true,
  searchButtonStyle: 'primary',
  searchLabel: <FormattedMessage id="ui-plugin-find-contact.button.addContact" />,
  addContacts: noop,
};

FindContactContainer.propTypes = {
  disabled: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  stripes: PropTypes.object,
  dataKey: PropTypes.string.isRequired,
  addContacts: PropTypes.func,
};

export default FindContactContainer;
