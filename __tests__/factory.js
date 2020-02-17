import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Gallery from '../src/app/models/Gallery';

factory.define('User', User, () => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}));

factory.define('UserInvalid', User, () => ({
  name: faker.name.findName(),
}));

factory.define('Gallery', Gallery, () => ({
  title: faker.name.title(),
  description: faker.lorem.paragraphs(3),
  status: 'Draft',
}));

factory.define('GalleryInvalid', Gallery, () => ({
  status: 'Draft',
}));

export default factory;
