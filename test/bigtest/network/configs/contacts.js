import { CONTACTS_API } from '@folio/organizations/src/common/constants';

const configContacts = server => {
  server.get(`${CONTACTS_API}`, (schema) => {
    return schema.contacts.all();
  });
};

export default configContacts;
