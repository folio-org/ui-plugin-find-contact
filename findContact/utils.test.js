import { transformCategoryIdsToLables } from './utils';

const categories = [
  { id: '01', value: 'category-01' },
  { id: '02', value: 'category-02' },
  { id: '03', value: 'category-03' },
];

const categoriesIds = ['01', '02', '03'];

describe('transformCategoryIdsToLables fn', () => {
  it('should return labels', () => {
    const labels = transformCategoryIdsToLables(categories, categoriesIds);

    expect(labels).toBe('category-01, category-02, category-03');
  });

  it('should return empty string', () => {
    const labels = transformCategoryIdsToLables(categories);

    expect(labels).toBe('');
  });
});
