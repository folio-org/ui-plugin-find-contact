import { QueryClient, QueryClientProvider } from 'react-query';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { useFetchContacts } from './hooks';
import PluginFindContacts from './PluginFindContacts';

jest.mock('@folio/stripes-acq-components/lib/AcqList/hooks/useFiltersToogle', () => ({
  useFiltersToogle: jest.fn(() => ({ isFiltersOpened: true, toggleFilters: jest.fn() })),
}));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useFetchContacts: jest.fn(),
}));

const defaultProps = {
  addContacts: jest.fn(),
  isMultiSelect: true,
  renderNewContactBtn: () => <>New</>,
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const contacts = [{
  id: 'id',
  inactive: false,
  lastName: 'Galt',
  firstName: 'John',
  value: 'Test contact',
  categories: ['id'],
  categoryLabels: 'Test category',
}];

const fetchContacts = jest.fn(() => Promise.resolve({ contacts, totalRecords: contacts.length }));

const renderPluginFindContacts = (props = {}) => render(
  <PluginFindContacts
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('PluginFindContacts component', () => {
  beforeEach(() => {
    defaultProps.addContacts.mockClear();
    fetchContacts.mockClear();
    useFetchContacts.mockClear().mockReturnValue({ fetchContacts });
  });

  it('should render find-contacts plugin', async () => {
    renderPluginFindContacts();

    expect(screen.getByText('ui-plugin-find-contact.button.addContact')).toBeDefined();
  });

  it('should render plugin modal when \'Add contact\' button was clicked', async () => {
    renderPluginFindContacts();

    await user.click(screen.getByText('ui-plugin-find-contact.button.addContact'));

    expect(screen.getByText('ui-plugin-find-contact.modal.title')).toBeInTheDocument();
  });
});
