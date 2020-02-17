import request from 'supertest';
import { resolve } from 'path';
import app from '../../src/app';

import factory from '../factory';
import truncate from '../utils/truncate';
import { clearProfile } from '../utils/destroyer';

describe('ProfileImages', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Store: Should be able to store images into de server', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = await userResponse.body;

    const response = await request(app)
      .post(`/users/${id}/profile-img`)
      .set('Authorization', `Bearer ${token}`)
      .attach(
        'file',
        resolve(__dirname, '..', 'imgs-profile', 'profile-test.jpg')
      );

    expect(response.body).toHaveProperty('id');

    clearProfile(response.body.name);
  });

  it('Show: Should respond with status 400 if image not found', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = await userResponse.body;

    const response = await request(app)
      .get(`/users/${id}/profile-img`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('Show: Should be able to show one image', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = await userResponse.body;

    await request(app)
      .post(`/users/${id}/profile-img`)
      .set('Authorization', `Bearer ${token}`)
      .attach(
        'file',
        resolve(__dirname, '..', 'imgs-profile', 'profile-test.jpg')
      );

    const response = await request(app)
      .get(`/users/${id}/profile-img`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('id');

    clearProfile(response.body.name);
  });

  it('Delete: Should be able to delete one image', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = await userResponse.body;

    const fileUpload = await request(app)
      .post(`/users/${id}/profile-img`)
      .set('Authorization', `Bearer ${token}`)
      .attach(
        'file',
        resolve(__dirname, '..', 'imgs-profile', 'profile-test.jpg')
      );

    const response = await request(app)
      .delete(`/users/${id}/profile-img`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    clearProfile(fileUpload.body.name);
  });

  it('Delete: Should be able to respond with status 400 if profile image is not found', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const response = await request(app)
      .delete(`/users/887888/profile-img`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
