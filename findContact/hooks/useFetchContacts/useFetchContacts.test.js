import { QueryClient, QueryClientProvider } from 'react-query';

import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  CONTACTS_API,
  PRIVILEGED_CONTACT_URL,
} from '../../api';
import { useFetchContacts } from './useFetchContacts';

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

const getPrivilegedContactsMock = jest.fn((api) => ({
  json: () => Promise.resolve(
    api === PRIVILEGED_CONTACT_URL
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

    await act(async () => {
      await result.current.fetchContacts({
        searchParams: { sorting: 'name' },
        offset: 30,
      });
    });

    expect(getMock).toHaveBeenCalled();
  });

  it('should fetch contacts from privileged contacts API', async () => {
    const { result } = renderHook(() => useFetchContacts({ isPrivilegedContactEnabled: true }), { wrapper });

    await act(async () => {
      await result.current.fetchContacts({
        searchParams: { sorting: 'name' },
        offset: 30,
      });
    });

    expect(getMock).toHaveBeenCalledWith('organizations-storage/privileged-contacts', expect.anything());
  });
});
