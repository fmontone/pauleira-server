import User from '../models/User';
import ProfileImage from '../models/ProfileImage';

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'a_k_a', 'role', 'created_at'],
      include: [
        { model: ProfileImage, as: 'profile_image', attributes: ['url'] },
      ],
    });

    return res.json(users);
  }

  async show(req, res) {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'a_k_a', 'role', 'created_at'],
      include: [
        { model: ProfileImage, as: 'profile_image', attributes: ['url'] },
      ],
    });

    if (!user) return res.status(400).json({ error: 'User does not exists' });

    return res.json(user);
  }

  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res
        .status(400)
        .json({ error: 'User Already registered with this e-mail.' });
    }

    const { id, name, email, role } = await User.create(req.body);

    return res.json({ id, name, email, role });
  }

  async update(req, res) {
    const { name, email, oldPassword, password, a_k_a } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (email) {
      const emailExists = await User.findOne({
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
      a_k_a,
    });

    return res.json({ message: 'User successfuly updated' });
  }

  async delete(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    User.destroy({ where: { id } });

    return res.json({ message: 'User successfully deleted' });
  }
}

export default new UserController();
