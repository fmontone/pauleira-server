import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
import multer from 'multer';
import multerProfileConfig from './config/multerProfile';
import multerGalleryConfig from './config/multerGallery';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import GalleryController from './app/controllers/GalleryController';
import GalleryImageController from './app/controllers/GalleryImageController';
import GalleryLikeController from './app/controllers/GalleryLikeController';
import ProfileImageController from './app/controllers/ProfileImageController';

import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateGalleryStore from './app/validators/GalleryStore';
import validateGalleryUpdate from './app/validators/GalleryUpdate';

import redisConfig from './config/redis';
import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

const uploadProfile = multer(multerProfileConfig);
const uploadGallery = multer(multerGalleryConfig);

// OPEN ROUTES

// 1. GalleryLikes | UPDATE
routes.put(
  '/galleries/:gallery_id/likes/:total_likes',
  GalleryLikeController.update
);

// SESSION
// ***EXPRESS-BRUTE PREJUDICES JEST TESTS***

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  routes.post('/session', SessionController.store);
} else {
  const bruteStore = new BruteRedis(redisConfig);
  const bruteForce = new Brute(bruteStore);
  routes.post('/session', bruteForce.prevent, SessionController.store);
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<< MOSTRA A PULSEIRA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// AUTH middleware
routes.use(AuthMiddleware);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<< MOSTRA A PULSEIRA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// 1. Users | INDEX
routes.get('/users', UserController.index);
// 2. Users | SHOW
routes.get('/users/:id', UserController.show);
// 3. Users | STORE
routes.post('/users', validateUserStore, UserController.store);
// 4. Users | UPDATE
routes.put('/users/:id', validateUserUpdate, UserController.update);
// 5. Users | DELETE
routes.delete('/users/:id', UserController.delete);

// 1. Avatar | STORE
routes.post(
  '/users/:user_id/profile-img',
  uploadProfile.single('file'),
  ProfileImageController.store
);

// 1. Avatar | SHOW
routes.get('/users/:user_id/profile-img', ProfileImageController.show);
// 2. Avatar | DELETE
routes.delete('/users/:user_id/profile-img', ProfileImageController.delete);

// 1. Gallery | INDEX
routes.get('/galleries', GalleryController.index);
// 2. Gallery | SHOW
routes.get('/galleries/:id', GalleryController.show);
// 3. Gallery | STORE
routes.post('/galleries', validateGalleryStore, GalleryController.store);
// 4. Gallery | UPDATE
routes.put('/galleries/:id', validateGalleryUpdate, GalleryController.update);
// 5. Gallery | DELETE
routes.delete('/galleries/:id', GalleryController.delete);

// 1. GalleryImage | INDEX
routes.get('/galleries/:gallery_id/images', GalleryImageController.index);
// 2. GalleryImage | SHOW
routes.get('/galleries/:gallery_id/:image_id', GalleryImageController.show);
// 3. GalleryImage | STORE
routes.post(
  '/galleries/:gallery_id/gallery-img',
  uploadGallery.single('file'),
  GalleryImageController.store
);
// 4. GalleryImage | UPDATE
routes.put('/galleries/:gallery_id/:image_id', GalleryImageController.update);
// 5. GalleryImage | DELETE
routes.delete(
  '/galleries/:gallery_id/:image_id',
  GalleryImageController.delete
);

export default routes;
