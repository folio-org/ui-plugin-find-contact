import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

import {
  PluginFindRecord,
  PluginFindRecordModal,
} from '@folio/stripes-acq-components';

import FindContactContainer from './FindContactContainer';

const PluginFindContacts = ({ addContacts, isMultiSelect, renderNewContactBtn, ...rest }) => (
  <PluginFindRecord
    {...rest}
    selectRecordsCb={addContacts}
  >
    {(modalProps) => (
      <FindContactContainer>
        {(viewProps) => (
          <PluginFindRecordModal
            {...viewProps}
            {...modalProps}
            isMultiSelect={isMultiSelect}
            renderNewBtn={renderNewContactBtn}
            getRecordLabel={({ lastName, firstName }) => `${lastName}, ${firstName}`}
          />
        )}
      </FindContactContainer>
    )}
  </PluginFindRecord>
);

PluginFindContacts.propTypes = {
  disabled: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  addContacts: PropTypes.func,
  renderNewContactBtn: PropTypes.func,
  isMultiSelect: PropTypes.bool,
};

PluginFindContacts.defaultProps = {
  disabled: false,
  searchLabel: <FormattedMessage id="ui-plugin-find-contact.button.addContact" />,
  addContacts: noop,
  renderNewContactBtn: noop,
  isMultiSelect: true,
};

export default PluginFindContacts;
