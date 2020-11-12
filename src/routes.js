import { Router } from 'express';
import multer from 'multer';
import multerProfileConfig from './config/multerProfile';
import multerGalleryConfig from './config/multerGallery';

import AdminUserController from './app/controllers/AdminUserController';
import AdminUserActivateController from './app/controllers/AdminUserActivateController';
import AdminUserPassForgotController from './app/controllers/AdminUserPassForgotController';
import AdminUserPassResetController from './app/controllers/AdminUserPassResetController';
import AdminSessionController from './app/controllers/AdminSessionController';
import AdminProfileImageController from './app/controllers/AdminProfileImageController';
import AdminGalleryController from './app/controllers/AdminGalleryController';
import AdminGalleryImageController from './app/controllers/AdminGalleryImageController';
import AdminGalleryLikeController from './app/controllers/AdminGalleryLikeController';

import validateUserAdminStore from './app/validators/AdminUserStore';
import validateUserAdminUpdate from './app/validators/AdminUserUpdate';
import validateAdminGalleryStore from './app/validators/AdminGalleryStore';
import validateAdminGalleryUpdate from './app/validators/AdminGalleryUpdate';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

const storeProfile = multer(multerProfileConfig);
const storeGallery = multer(multerGalleryConfig);

/**
 * ----------------------------------------------------------------------------
 * [OPEN] Admin Users - Pass Forgot / PassReset / Activate Account
 * ----------------------------------------------------------------------------
 */

routes.put('/admin-users/pass-forgot/', AdminUserPassForgotController.update);
routes.put('/admin-users/activate/', AdminUserActivateController.update);

routes.get(
  '/admin-users/pass-reset/:id/:token',
  AdminUserPassResetController.show
);

routes.put('/admin-users/pass-reset/:id', AdminUserPassResetController.update);

/**
 * ----------------------------------------------------------------------------
 * [OPEN] SESSION
 * ----------------------------------------------------------------------------
 */

routes.post('/session-admin', AdminSessionController.store);

// 1. Gallery | INDEX
routes.get('/galleries', AdminGalleryController.index);
// 2. Gallery | SHOW
routes.get('/galleries/:id', AdminGalleryController.show);
// 3. GalleryLikes | UPDATE
routes.put(
  '/galleries/:gallery_id/likes/:total_likes',
  AdminGalleryLikeController.update
);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<< MOSTRA A PULSEIRA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// AUTH middleware
routes.use(AuthMiddleware);

// <<<<<<<<<<<<<<<<<<<<<<<<<<<< MOSTRA A PULSEIRA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/**
 * ----------------------------------------------------------------------------
 * Admin Users
 * ----------------------------------------------------------------------------
 */

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
 * ----------------------------------------------------------------------------
 * Admin Profile Images
 * ----------------------------------------------------------------------------
 */

// 1. Profile Image | STORE
routes.post(
  '/admin-users/profile-img/:user_id',
  storeProfile.single('file'),
  AdminProfileImageController.store
);

// 1. Profile Image | SHOW
routes.get(
  '/admin-users/profile-img/:user_id',
  AdminProfileImageController.show
);

// 2. Profile Image | DELETE
routes.delete(
  '/admin-users/profile-img/:user_id',
  AdminProfileImageController.delete
);

/**
 * ----------------------------------------------------------------------------
 * Admin Galleries
 * ----------------------------------------------------------------------------
 */

// 1. Gallery | STORE
routes.post(
  '/galleries',
  validateAdminGalleryStore,
  AdminGalleryController.store
);
// 2. Gallery | UPDATE
routes.put(
  '/galleries/:id',
  validateAdminGalleryUpdate,
  AdminGalleryController.update
);
// 3. Gallery | DELETE
routes.delete('/galleries/:id', AdminGalleryController.delete);

/**
 * ----------------------------------------------------------------------------
 * Admin Gallery Images
 * ----------------------------------------------------------------------------
 */

// 1. GalleryImage | INDEX
routes.get('/galleries/images/:gallery_id', AdminGalleryImageController.index);

// 3. GalleryImage | STORE
routes.post(
  '/galleries/add-img/:gallery_id/:position',
  storeGallery.single('file'),
  AdminGalleryImageController.store
);

// 4. GalleryImage | UPDATE
routes.put(
  '/galleries/images/:gallery_id/:image_id',
  AdminGalleryImageController.update
);

// 5. GalleryImage | DELETE
routes.delete(
  '/galleries/remove-img/:gallery_id/:image_id',
  AdminGalleryImageController.delete
);

export default routes;
