import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      likes: Yup.string(),
      status: Yup.string(),
      user_id: Yup.number(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation Fails', messages: err.inner });
  }
};
