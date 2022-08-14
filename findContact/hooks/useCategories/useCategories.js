import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { CATEGORIES_API } from '../../api';

export const useCategories = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'categories' });

  const searchParams = {
    limit: LIMIT_MAX,
  };

  const queryKey = [namespace];
  const queryFn = () => ky.get(CATEGORIES_API, { searchParams }).json();

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey,
    queryFn,
  });

  return {
    categories: data?.categories || [],
    totalRecords: data?.totalRecords,
    isLoading,
  };
};
