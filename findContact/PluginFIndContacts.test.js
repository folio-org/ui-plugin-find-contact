import React from 'react';
import { render } from '@testing-library/react';

import PluginFindContacts from './PluginFindContacts';

const renderPluginFindContacts = () => (render(
  <PluginFindContacts />,
));

describe('PluginFindContacts component', () => {
  it('should render find-contacts plugin', async () => {
    const { getByText } = renderPluginFindContacts();

    expect(getByText('ui-plugin-find-contact.button.addContact')).toBeDefined();
  });
});
