import UserAdmin from '../models/UserAdmin';
import ProfileImage from '../models/ProfileImage';

class UserAdminController {
  async index(req, res) {
    const users = await UserAdmin.findAll({
      attributes: ['id', 'name', 'email', 'created_at'],
      include: [
        { model: ProfileImage, as: 'profile_image', attributes: ['url'] },
      ],
    });

    return res.json(users);
  }

  async show(req, res) {
    const user = await UserAdmin.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'created_at'],
      include: [
        { model: ProfileImage, as: 'profile_image', attributes: ['url'] },
      ],
    });

    if (!user) return res.status(400).json({ error: 'User does not exists' });

    return res.json(user);
  }

  async store(req, res) {
    const userExists = await UserAdmin.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ error: 'User Already registered with this e-mail.' });
    }

    const { id, name, email } = await UserAdmin.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const { name, email, oldPassword, password } = req.body;

    const user = await UserAdmin.findByPk(req.params.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (email) {
      const emailExists = await UserAdmin.findOne({
        where: { email: req.body.email },
      });

      if (emailExists) {
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
    const user = await UserAdmin.findByPk(id);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    UserAdmin.destroy({ where: { id } });

    return res.json({ message: 'User successfully deleted' });
  }
}

export default new UserAdminController();
