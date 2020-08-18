import Gallery from '../models/Gallery';
import GalleryImage from '../models/GalleryImage';
import User from '../models/User';

class GalleryController {
  async index(req, res) {
    const response = await Gallery.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'a_k_a'],
        },
        {
          model: GalleryImage,
          as: 'images',
        },
      ],
    });

    return res.json(response);
  }

  async show(req, res) {
    const gallery = await Gallery.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'a_k_a'],
        },
        {
          model: GalleryImage,
          as: 'images',
        },
      ],
    });

    return res.json(gallery);
  }

  async store(req, res) {
    const gallery = await Gallery.create(req.body);

    return res.json(gallery);
  }

  async update(req, res) {
    const gallery = await Gallery.findByPk(req.params.id);

    if (!gallery) {
      return res.status(400).json({ error: 'Gallery not Found' });
    }

    await gallery.update(req.body);

    return res.json(gallery);
  }

  async delete(req, res) {
    const gallery = await Gallery.findByPk(req.params.id);

    if (!gallery) {
      return res.status(400).json({ error: 'Gallery not Found' });
    }

    gallery.destroy();

    return res.json({ message: 'Gallery Successfully deleted' });
  }
}

export default new GalleryController();
