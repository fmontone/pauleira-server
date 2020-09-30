import AdminGalleryImage from '../models/AdminGalleryImage';
import AdminGallery from '../models/AdminGallery';

class AdminGalleryImageController {
  async index(req, res) {
    const { gallery_id } = req.params;

    const gallery = await AdminGallery.findOne({
      where: { id: gallery_id },
    });

    if (!gallery) {
      return res.json({
        message: 'The gallery you are looking for does not exist',
      });
    }

    const images = await AdminGalleryImage.findAll({ where: { gallery_id } });

    return res.json(images);
  }

  async store(req, res) {
    const { title, description } = req.body;
    const { gallery_id } = req.params;

    /**
     * First we check if gallery exixts
     */
    const gallery = await AdminGallery.findOne({
      where: { id: gallery_id },
    });

    if (!gallery) {
      return res.json({
        message: 'The gallery you are looking for does not exist',
      });
    }

    const defaultURL = `${process.env.APP_URL}/uploads/admin-galleries/${req.params.gallery_id}/${req.file.filename}`;
    const { position } = req.params;

    const { location: url = defaultURL } = req.file;

    const image = await AdminGalleryImage.create({
      title,
      description,
      gallery_id,
      url,
      position: Number(position),
    });

    return res.json(image);
  }

  async update(req, res) {
    const { image_id } = req.params;
    const image = await AdminGalleryImage.findByPk(image_id);

    await image.update(req.body);

    return res.json(image);
  }

  async delete(req, res) {
    const { image_id } = req.params;
    const image = await AdminGalleryImage.findByPk(image_id);

    await image.destroy();

    return res.json({ message: 'Image successfully deleted' });
  }
}

export default new AdminGalleryImageController();
