import request from 'supertest';
import app from '../../src/app';

import factory from '../factory';
import truncate from '../utils/truncate';

describe('GalleryLikes', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Store: should be able to add likes to galleries', async () => {
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

    const gallery_id = galleryResponse.body.id;

    const response = await request(app).put(
      `/galleries/${gallery_id}/likes/50`
    );

    expect(response.body.likes).toBe(50);
  });
});
