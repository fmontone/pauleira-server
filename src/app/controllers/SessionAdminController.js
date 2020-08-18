import jwt from 'jsonwebtoken';

import UserAdmin from '../models/UserAdmin';

import authConfig from '../../config/auth';

class SessionAdminController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await UserAdmin.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: 'Incorrect email or password' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(403).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      id,
      name,
      email,
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionAdminController();
