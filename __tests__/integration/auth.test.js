import request from 'supertest';
import app from '../../src/app';

import truncate from '../utils/truncate';
import factory from '../factory';

describe('Auth', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Store: Should throw status 401 if user not found', async () => {
    const response = await request(app)
      .post('/session')
      .send({
        email: 'emailinvalido@dominio.com',
        password: '987654',
      });

    expect(response.status).toBe(400);
  });

  it('Store: Should throw status 403 if wrong password is given', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User', {
      email: 'user@email.com',
      password: '123456',
    });

    await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const response = await request(app)
      .post('/session')
      .send({
        email: 'user@email.com',
        password: '100',
      });

    expect(response.status).toBe(403);
  });

  it('Store: Should response with id, name, email and token properties', async () => {
    await factory.create('User', {
      name: 'Fabio Montone',
      email: 'montone@gmail.com',
      password: '123456',
    });

    const response = await request(app)
      .post('/session')
      .send({
        email: 'montone@gmail.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('token');
  });

  it('Store: should respond with status 401 if token not provideded.', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(401);
  });

  it('Store: should respond with status 401 if token is invalid.', async () => {
    const { token } = 'im12an34.invalid56.token887';

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
  });
});
