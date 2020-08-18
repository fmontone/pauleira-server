import { Router } from 'express';
import multer from 'multer';
import multerProfileConfig from './config/multerProfile';
// import multerGalleryConfig from './config/multerGallery';

import AdminUserController from './app/controllers/AdminUserController';
import SessionAdminController from './app/controllers/AdminSessionController';
import ProfileImageController from './app/controllers/AdminProfileImageController';

import validateUserAdminStore from './app/validators/AdminUserStore';
import validateUserAdminUpdate from './app/validators/AdminUserUpdate';
// import validateGalleryStore from './app/validators/GalleryStore';
// import validateGalleryUpdate from './app/validators/GalleryUpdate';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

const uploadProfile = multer(multerProfileConfig);
// const uploadGallery = multer(multerGalleryConfig);

// OPEN ROUTES

// // 1. Gallery | INDEX
// routes.get('/galleries', GalleryController.index);
// // 2. Gallery | SHOW
// routes.get('/galleries/:id', GalleryController.show);

// // 3. GalleryLikes | UPDATE
// routes.put(
//   '/galleries/:gallery_id/likes/:total_likes',
//   GalleryLikeController.update
// );

// SESSION

routes.post('/session-admin', SessionAdminController.store);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<< MOSTRA A PULSEIRA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// AUTH middleware
routes.use(AuthMiddleware);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<< MOSTRA A PULSEIRA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// 1. ADMIN Users | INDEX
routes.get('/admin-users', AdminUserController.index);
// 2. ADMIN Users | SHOW
routes.get('/admin-users/:id', AdminUserController.show);
// 3. ADMIN Users | STORE
routes.post('/admin-users', validateUserAdminStore, AdminUserController.store);
// 4. ADMIN Users | UPDATE
routes.put(
  '/admin-users/:id',
  validateUserAdminUpdate,
  AdminUserController.update
);
// 5. ADMIN Users | DELETE
routes.delete('/admin-users/:id', AdminUserController.delete);

/**
 *
 *
 * Admin Profile Images
 *
 *
 */

// 1. Profile Image | STORE
routes.post(
  '/admin-users/:user_id/profile-img',
  uploadProfile.single('file'),
  ProfileImageController.store
);

// 1. Profile Image | SHOW
routes.get('/admin-users/:user_id/profile-img', ProfileImageController.show);

// 2. Profile Image | DELETE
routes.delete(
  '/admin-users/:user_id/profile-img',
  ProfileImageController.delete
);

/**
 *
 *
 * Admin Galleries
 *
 *
 */

// // 1. Gallery | STORE
// routes.post('/galleries', validateGalleryStore, GalleryController.store);
// // 2. Gallery | UPDATE
// routes.put('/galleries/:id', validateGalleryUpdate, GalleryController.update);
// // 3. Gallery | DELETE
// routes.delete('/galleries/:id', GalleryController.delete);

// // 1. GalleryImage | INDEX
// routes.get('/galleries/:gallery_id/images', GalleryImageController.index);
// // 2. GalleryImage | SHOW
// routes.get('/galleries/:gallery_id/:image_id', GalleryImageController.show);
// // 3. GalleryImage | STORE
// routes.post(
//   '/galleries/:gallery_id/gallery-img',
//   uploadGallery.single('file'),
//   GalleryImageController.store
// );
// // 4. GalleryImage | UPDATE
// routes.put('/galleries/:gallery_id/:image_id', GalleryImageController.update);
// // 5. GalleryImage | DELETE
// routes.delete(
//   '/galleries/:gallery_id/:image_id',
//   GalleryImageController.delete
// );

export default routes;
