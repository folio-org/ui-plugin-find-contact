import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useCategories } from './useCategories';

const categories = [{
  id: 'id',
  value: 'Test category',
}];

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCategories', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ categories }),
        }),
      });
  });

  it('should fetch categories', async () => {
    const { result, waitFor } = renderHook(() => useCategories(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.categories).toEqual(categories);
  });
});
