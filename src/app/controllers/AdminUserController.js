import AdminUser from '../models/AdminUser';
import AdminProfileImage from '../models/AdminProfileImage';

class AdminUserController {
  async index(req, res) {
    const users = await AdminUser.findAll({
      attributes: ['id', 'name', 'email', 'created_at'],
      include: [
        { model: AdminProfileImage, as: 'profile_image', attributes: ['url'] },
      ],
    });

    return res.json(users);
  }

  async show(req, res) {
    const user = await AdminUser.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'created_at'],
      include: [
        { model: AdminProfileImage, as: 'profile_image', attributes: ['url'] },
      ],
    });

    if (!user) return res.status(400).json({ error: 'User does not exists' });

    return res.json(user);
  }

  async store(req, res) {
    const userExists = await AdminUser.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ error: 'User Already registered with this e-mail.' });
    }

    const { id, name, email } = await AdminUser.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const { name, email, oldPassword, password } = req.body;

    const user = await AdminUser.findByPk(req.params.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (email) {
      const emailExists = await AdminUser.findOne({
        where: { email: req.body.email },
      });

      if (emailExists && emailExists.id !== req.params.id) {
        return res
          .status(400)
          .json({ error: 'User Already registered with this e-mail.' });
      }
    }

    if (password) {
      if (!(await user.checkPassword(oldPassword))) {
        return res.status(400).json({ error: 'Old password does not match' });
      }
    }

    await user.update({
      name,
      email,
      password,
    });

    return res.json({ message: 'User successfuly updated' });
  }

  async delete(req, res) {
    const { id } = req.params;
    const user = await AdminUser.findByPk(id);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    AdminUser.destroy({ where: { id } });

    return res.json({ message: 'User successfully deleted' });
  }
}

export default new AdminUserController();
