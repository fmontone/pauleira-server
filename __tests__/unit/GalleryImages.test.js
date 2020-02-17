import request from 'supertest';
import { resolve } from 'path';
import app from '../../src/app';

import factory from '../factory';
import truncate from '../utils/truncate';
import { clearGallery } from '../utils/destroyer';

describe('GalleryImages', () => {
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

    const gallery = await factory.attrs('Gallery', {
      user_id: id,
      made_by: id,
    });

    const galleryRegister = await request(app)
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .send(gallery);

    const galleryId = galleryRegister.body.id;

    const response = await request(app)
      .post(`/galleries/${galleryId}/gallery-img`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Imagem Bacana')
      .field('description', 'Uma imagem muito bacana mesmo')
      .attach(
        'file',
        resolve(__dirname, '..', 'imgs-gallery', 'galleryImageTest001.jpg')
      );

    expect(response.body).toHaveProperty('id');

    clearGallery(galleryId);
  });

  it('Index: Should be able to list all files in one Gallery', async () => {
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

    const galleryRegister = await request(app)
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .send(gallery);

    const galleryId = galleryRegister.body.id;

    await request(app)
      .post(`/galleries/${galleryId}/gallery-img`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Imagem um')
      .field('description', 'Uma galleria muito bacanuda mesmo')
      .attach(
        'file',
        resolve(__dirname, '..', 'imgs-gallery', 'galleryImageTest001.jpg')
      );

    await request(app)
      .post(`/galleries/${galleryId}/gallery-img`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Imagem dois')
      .field('description', 'Uma galleria muito bacanuda mesmo')
      .attach(
        'file',
        resolve(__dirname, '..', 'imgs-gallery', 'galleryImageTest001.jpg')
      );

    const response = await request(app)
      .get(`/galleries/${galleryId}/images`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.length).toBe(2);

    clearGallery(galleryId);
  });

  it('Show: Should be able to list one image register with given ID', async () => {
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

    const galleryRegister = await request(app)
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .send(gallery);

    const galleryId = galleryRegister.body.id;

    const image = await request(app)
      .post(`/galleries/${galleryId}/gallery-img`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Imagem um')
      .field('description', 'Uma galleria muito bacanuda mesmo')
      .attach(
        'file',
        resolve(__dirname, '..', 'imgs-gallery', 'galleryImageTest001.jpg')
      );

    const imageId = image.body.id;

    const response = await request(app)
      .get(`/galleries/${galleryId}/${imageId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('id');

    clearGallery(galleryId);
  });

  it('Update: Should be able to update image register', async () => {
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

    const galleryRegister = await request(app)
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .send(gallery);

    const galleryId = galleryRegister.body.id;

    const image = await request(app)
      .post(`/galleries/${galleryId}/gallery-img`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Imagem um')
      .field('description', 'Uma galleria muito bacanuda mesmo')
      .attach(
        'file',
        resolve(__dirname, '..', 'imgs-gallery', 'galleryImageTest001.jpg')
      );

    const imageId = image.body.id;

    const response = await request(app)
      .put(`/galleries/${galleryId}/${imageId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'imagem um com titulo alterado' });

    expect(response.body.title).toBe('imagem um com titulo alterado');

    clearGallery(galleryId);
  });

  it('Delete: Should be able to delete image register', async () => {
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

    const galleryRegister = await request(app)
      .post('/galleries')
      .set('Authorization', `Bearer ${token}`)
      .send(gallery);

    const galleryId = galleryRegister.body.id;

    const image = await request(app)
      .post(`/galleries/${galleryId}/gallery-img`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Imagem um')
      .field('description', 'Uma galleria muito bacanuda mesmo')
      .attach(
        'file',
        resolve(__dirname, '..', 'imgs-gallery', 'galleryImageTest001.jpg')
      );

    const imageId = image.body.id;

    const response = await request(app)
      .delete(`/galleries/${galleryId}/${imageId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    clearGallery(galleryId);
  });
});
