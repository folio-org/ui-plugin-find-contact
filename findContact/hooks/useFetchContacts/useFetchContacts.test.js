import { renderHook } from '@testing-library/react-hooks';

import {
  useOkapiKy,
} from '@folio/stripes/core';

import { useFetchContacts } from './useFetchContacts';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const getMock = jest.fn().mockReturnValue({
  json: () => ({ categories: [], totalRecords: 0 }),
});

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
    const { result } = renderHook(() => useFetchContacts());

    await result.current.fetchContacts({ searchParams: {}, offset: 30 });

    expect(getMock).not.toHaveBeenCalled();
  });
});
