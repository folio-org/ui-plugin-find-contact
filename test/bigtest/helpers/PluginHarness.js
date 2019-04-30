import React from 'react';
import noop from 'lodash/noop';
import { Pluggable, withStripes } from '@folio/stripes/core';

class PluginHarness extends React.Component {
  render() {
    return (
      <Pluggable
        aria-haspopup="true"
        type="find-contact"
        id="clickable-find-contact"
        searchLabel="Look up contacts"
        marginTop0
        searchButtonStyle="link"
        dataKey="contactsTest"
        addContacts={noop}
        {...this.props}
      >
        <span data-test-no-plugin-available>No plugin available!</span>
      </Pluggable>
    );
  }
}

export default withStripes(PluginHarness);
