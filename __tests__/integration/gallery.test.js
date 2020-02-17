import request from 'supertest';
import app from '../../src/app';

import factory from '../factory';
import truncate from '../utils/truncate';

describe('Gallery', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Should respond with status 400 if Validation Fails ', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = await userResponse.body;

    const gallery = await factory.attrs('GalleryInvalid', {
      user_id: id,
      made_by: id,
    });

    const response = await request(app)
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .send(gallery);

    expect(response.status).toBe(400);
  });

  it('Store: Should be able to register a new gallery', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = await userResponse.body;

    const gallery = await factory.attrs('Gallery', {
      user_id: id,
      made_by: id,
    });

    const response = await request(app)
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .send(gallery);

    expect(response.body).toHaveProperty('id');
  });

  it('Index: Should be able to list all galleries in DB', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = await userResponse.body;

    const gallery1 = await factory.attrs('Gallery', {
      user_id: id,
      made_by: id,
    });
    const gallery2 = await factory.attrs('Gallery', {
      user_id: id,
      made_by: id,
    });

    await request(app)
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .send(gallery1);

    await request(app)
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .send(gallery2);

    const response = await request(app)
      .get('/galleries')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.length).toBe(2);
  });

  it('Show: Should be able to show a Gallery by given id', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = await userResponse.body;

    const gallery = await factory.attrs('Gallery', {
      user_id: id,
      made_by: id,
    });

    const galleryResponse = await request(app)
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .send(gallery);

    const galleryId = galleryResponse.body.id;

    const response = await request(app)
      .get(`/galleries/${galleryId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('id');
  });

  it('Update: Should respond with status 400 if gallery not found', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const response = await request(app)
      .put(`/galleries/7000`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Test Title', description: 'Some new teste text' });

    expect(response.status).toBe(400);
  });

  it('Update: Should be able to update a Gallery', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = await userResponse.body;

    const gallery = await factory.attrs('Gallery', {
      user_id: id,
      made_by: id,
    });

    const galleryResponse = await request(app)
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .send(gallery);

    const galleryId = galleryResponse.body.id;

    const response = await request(app)
      .put(`/galleries/${galleryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Test Title', description: 'Some new teste text' });

    expect(response.status).toBe(200);
  });

  it('Update: Should be able to delete a Gallery', async () => {
    const authUser = await factory.create('User');
    const { token } = await authUser.generateToken();

    const user = await factory.attrs('User');

    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    const { id } = await userResponse.body;

    const gallery = await factory.attrs('Gallery', {
      user_id: id,
      made_by: id,
    });

    const galleryResponse = await request(app)
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .send(gallery);

    const galleryId = galleryResponse.body.id;

    await request(app)
      .delete(`/galleries/${galleryId}`)
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .delete(`/galleries/${galleryId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
