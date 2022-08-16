import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useCategories } from '../hooks';
import { ContactsListFilters } from './ContactsListFilters';

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useCategories: jest.fn(),
}));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderContactsListFilters = (props = {}) => render(
  <ContactsListFilters
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

const categories = [{
  id: 'id',
  value: 'Test category',
}];

describe('ContactsListFilters', () => {
  beforeEach(() => {
    defaultProps.applyFilters.mockClear();

    useCategories.mockClear().mockReturnValue({
      categories,
      totalRecords: categories.length,
    });
  });

  it('should display fund list filters', () => {
    renderContactsListFilters();

    expect(screen.getByText('ui-plugin-find-contact.contact.status.inactive')).toBeInTheDocument();
    expect(screen.getByText('ui-plugin-find-contact.contact.categories')).toBeInTheDocument();
  });

  it('should call \'applyFilters\' when a filter was applied', () => {
    renderContactsListFilters();

    user.click(screen.getByText(categories[0].value));

    expect(defaultProps.applyFilters).toHaveBeenCalled();
  });
});
