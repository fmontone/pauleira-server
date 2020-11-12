import AdminGallery from '../models/AdminGallery';

class GalleryLikesController {
  async update(req, res) {
    const { gallery_id, total_likes } = req.params;

    const gallery = await AdminGallery.findByPk(gallery_id);

    const updateLikes = Number(gallery.likes) + Number(total_likes);

    await gallery.update({ likes: updateLikes });

    return res.json({ likes: gallery.likes });
  }
}

export default new GalleryLikesController();
