import { CATEGORIES_API } from '../../../../findContact/api';

const configCategories = server => {
  server.get(CATEGORIES_API, (schema) => {
    return schema.categories.all();
  });
};

export default configCategories;
