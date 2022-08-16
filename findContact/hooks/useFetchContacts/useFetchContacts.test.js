import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  useOkapiKy,
} from '@folio/stripes/core';

import { useFetchContacts } from './useFetchContacts';
import { CONTACTS_API } from '../../api';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const categories = [{
  id: 'id',
  value: 'Test category',
}];
const contacts = [{
  id: 'id',
  value: 'Test contact',
  categories: ['id'],
}];

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const getMock = jest.fn((api) => ({
  json: () => Promise.resolve(
    api === CONTACTS_API
      ? { contacts, totalRecords: contacts.length }
      : { categories, totalRecords: categories.length },
  ),
}));

describe('useFetchContacts', () => {
  beforeEach(() => {
    getMock.mockClear();

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: getMock,
      });
  });

  it('should fetch contacts', async () => {
    const { result } = renderHook(() => useFetchContacts(), { wrapper });

    await result.current.fetchContacts({
      searchParams: { sorting: 'name' },
      offset: 30,
    });

    expect(getMock).toHaveBeenCalled();
  });
});
