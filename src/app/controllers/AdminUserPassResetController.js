import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import AdminUser from '../models/AdminUser';
import adminUserActivateConfig from '../../config/adminUserActivateConfig';

class AdminUserPassResetController {
  async show(req, res) {
    const { token } = req.params;

    try {
      await promisify(jwt.verify)(token, adminUserActivateConfig.secret);
    } catch (err) {
      console.log('# # # TOKEN ERROR', err);
      return res.status(401).json({ error: 'Token Invalid' });
    }

    try {
      await AdminUser.findOne({ where: { reset_link: token } });
    } catch (error) {
      return res
        .status(401)
        .json({ error: 'Token not registered to any user' });
    }

    return res.json({ message: 'Cheers! User found and token is valid!' });
  }

  async update(req, res) {
    const { id, password } = req.body;

    const user = await AdminUser.findByPk(id);

    console.log('&&&&&&&&& ID >>> ', id);

    await user.update({
      password,
    });

    return res.json({ message: 'Password successfuly updated' });
  }
}

export default new AdminUserPassResetController();
