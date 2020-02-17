import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';

import truncate from '../utils/truncate';
import factory from '../factory';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Index: should list all users in database', async () => {
    const userAuth = await factory.create('User');
    const { token } = userAuth.generateToken();

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('Show: should list one user with given id', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const persistUser = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = persistUser.body;

    const response = await request(app)
      .get(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.id).toBe(id);
  });

  it('Store: should encrypt password when new user is created', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('Store: should be able to add new user', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('Store: should not permit duplicated email register', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    expect(response.status).toBe(400);
  });

  it('Store: should respond with status 400 if schema is invalid', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('UserInvalid');

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    expect(response.status).toBe(400);
  });

  it('Update: Should respond with status 400 if schema is invalid', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const users = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    const { id } = users.body[0];

    const response = await request(app)
      .put(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ password: '998998' });

    expect(response.status).toBe(400);
  });

  it('Update: Should be able to update user info', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const users = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    const { id } = users.body[0];

    const response = await request(app)
      .put(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'montone@gmail.com' });

    expect(response.status).toBe(200);
  });

  it('Update: should not permit duplicated email register', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const testUser = await factory.attrs('User', {
      email: 'montone@gmail.com',
    });

    await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(testUser);

    const user = await factory.attrs('User');

    const inputUser = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = inputUser.body;

    const response = await request(app)
      .put(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'montone@gmail.com' });

    expect(response.status).toBe(400);
  });

  it('Update: Should return status 401 if user not found', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const response = await request(app)
      .put('/users/330533')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'montone@gmail.com' });

    expect(response.status).toBe(401);
  });

  it('Update: Should return status 400 if oldPassword does not match', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const inputUser = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = inputUser.body;

    const response = await request(app)
      .put(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'wrong123',
        password: '123456',
        confirmPassword: '123456',
      });

    expect(response.status).toBe(400);
  });

  it('Delete: Should return status 400 if user is not found', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    await request(app)
      .delete('/users/998878')
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/users/998878')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('Delete: Should be able to delete user', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const users = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    const { id } = users.body[0];

    await request(app)
      .delete(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
