import { CONTACTS_API } from '../../../../findContact/api';

const configContacts = server => {
  server.get(`${CONTACTS_API}`, (schema) => {
    return schema.contacts.all();
  });
};

export default configContacts;
