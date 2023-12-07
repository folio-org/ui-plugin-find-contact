// eslint-disable-next-line import/prefer-default-export
export const transformCategoryIdsToLabels = (categories, categoryIds = []) => {
  const categoriesMap = (categories || []).reduce((acc, category) => {
    acc[category.id] = category.value;

    return acc;
  }, {});

  return categoryIds.map(categoryId => categoriesMap[categoryId] || '').join(', ');
};
