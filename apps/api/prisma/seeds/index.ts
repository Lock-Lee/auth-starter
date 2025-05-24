/* eslint-disable no-console */

import { auth } from '@/libs/auth';

const users = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'password123',
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    password: 'password123',
  },
];

const seedData = async () => {
  console.log('seeding data...');

  for (const user of users) {
    try {
      await auth.api.signUpEmail({ body: user });
    } catch (error) {
      console.error('Failed to create user', user.email, error);
    }
  }

  console.log('successfully seeded data');
};

seedData().catch((e) => {
  console.error(e);
});
