import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  prefix: faker.name.prefix,
  firstName: faker.name.firstName,
  lastName: faker.name.lastName,
  notes: faker.lorem.text,
  categories: ['123'],
  addresses: [{ addressLine1: faker.address.streetAddress, isPrimary: true }],
  emails: [{ value: faker.internet.email, isPrimary: true }],
  phoneNumbers: [{ phoneNumber: faker.phone.phoneNumber }, { phoneNumber: faker.phone.phoneNumber }],
  urls: [{ value: faker.internet.url, isPrimary: true }],
});
