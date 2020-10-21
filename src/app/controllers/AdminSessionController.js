import jwt from 'jsonwebtoken';

import AdminUser from '../models/AdminUser';
import AdminProfileImage from '../models/AdminProfileImage';

import authConfig from '../../config/auth';

class SessionAdminController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await AdminUser.findOne({
      where: { email },
      include: [
        {
          model: AdminProfileImage,
          as: 'profile_image',
          attributes: ['url'],
        },
      ],
    });

    if (!user) {
      return res.status(400).json({ error: 'Incorrect email or password' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(403).json({ error: 'Password does not match' });
    }

    console.log('>>>>>USER>>>>>', user);

    const { id, name, profile_image } = user;

    return res.json({
      user: {
        id,
        name,
        profile_image,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionAdminController();
