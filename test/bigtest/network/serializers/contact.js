import BaseSerializer from './base';

const { isArray } = Array;

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.contacts)) {
      return {
        contacts: json.contacts,
        totalRecords: json.contacts.length,
      };
    }

    return json.contacts;
  },
});
