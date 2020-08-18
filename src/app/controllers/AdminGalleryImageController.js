import GalleryImage from '../models/GalleryImage';

class GalleryImageController {
  async index(req, res) {
    const { gallery_id } = req.params;

    const images = await GalleryImage.findAll({ where: { gallery_id } });

    return res.json(images);
  }

  async show(req, res) {
    const { image_id } = req.params;

    const image = await GalleryImage.findByPk(image_id);

    return res.json(image);
  }

  async store(req, res) {
    const { title, description } = req.body;
    const { gallery_id } = req.params;

    const defaultURL = `${process.env.APP_URL}/uploads/galleries/${req.params.gallery_id}/${req.file.filename}`;

    const { location: url = defaultURL } = req.file;

    const image = await GalleryImage.create({
      title,
      description,
      gallery_id,
      url,
    });

    return res.json(image);
  }

  async update(req, res) {
    const { image_id } = req.params;
    const image = await GalleryImage.findByPk(image_id);

    await image.update(req.body);

    return res.json(image);
  }

  async delete(req, res) {
    const { image_id } = req.params;
    const image = await GalleryImage.findByPk(image_id);

    await image.destroy();

    return res.json({ message: 'Image successfully deleted' });
  }
}

export default new GalleryImageController();
