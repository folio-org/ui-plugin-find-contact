import React from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
} from '@folio/stripes/components';

class FindContactModal extends React.Component {
  closeModal = () => {
    this.props.closeCB();
  }

  render() {
    return (
      <Modal
        dismissible
        label=""
        onClose={this.closeModal}
        open
        size="large"
      >
        Add Contacts
      </Modal>
    );
  }
}

FindContactModal.propTypes = {
  // stripes: PropTypes.object.isRequired,
  closeCB: PropTypes.func.isRequired,
  // addContacts: PropTypes.func,
};

export default FindContactModal;
