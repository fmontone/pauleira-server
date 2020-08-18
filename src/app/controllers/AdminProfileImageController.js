import AdminProfileImage from '../models/AdminProfileImage';

class AdminProfileImageController {
  async show(req, res) {
    const { user_id } = req.params;

    const image = await AdminProfileImage.findOne({ where: { user_id } });

    if (!image) {
      return res
        .status(400)
        .json({ message: 'This user does not have a profile image' });
    }

    return res.json(image);
  }

  async store(req, res) {
    const defaultURL = `${process.env.APP_URL}/uploads/admin-profile/${req.file.filename}`;

    const { key: name, location: url = defaultURL } = req.file;
    const { user_id } = req.params;

    const image = await AdminProfileImage.create({
      name,
      url,
      user_id,
    });

    return res.json(image);
  }

  async delete(req, res) {
    const { user_id } = req.params;
    const image = await AdminProfileImage.findOne({ where: { user_id } });

    if (!image) {
      return res.status(400).json({ message: 'Profile Image not found' });
    }

    await image.destroy();

    return res.json({ message: 'Image successfully deleted' });
  }
}

export default new AdminProfileImageController();
