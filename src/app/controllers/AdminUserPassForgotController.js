import jwt from 'jsonwebtoken';

import AdminUser from '../models/AdminUser';
import adminUserActivateConfig from '../../config/adminUserActivateConfig';
import sendEmail from '../../config/nodeMailer';

class AdminUserPassForgotController {
  async update(req, res) {
    const { email } = req.body;

    const user = await AdminUser.findOne({
      where: { email },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: 'User not registered with this email' });
    }

    const { id } = user;

    const token = jwt.sign({ id }, adminUserActivateConfig.secret, {
      expiresIn: adminUserActivateConfig.expiresIn,
    });

    try {
      await user.update({ reset_link: token });
    } catch (err) {
      return res.status(500).json({
        error:
          'We could not connect to server. Try again in a few minuts or communicate de administrator',
      });
    }

    try {
      const link = `${process.env.CLIENT_ADMIN_URL}/admin-users/pass-reset/${id}/${token}`;
      const subject = 'Recupere sua Senha';

      const text = `
      Clique no link abaixo - ou copie e cole o código do link em seu navegador -  para recuperar sua senha na área administrativa da Pauleira:
      ${link}
    `;
      const html = `
          <h3>Recupere sua senha</h3>
          <p>Clique no link abaixo - ou copie e cole o código do link em seu navegador -  para recuperar sua senha na área administrativa da Pauleira:</p>
          <a href="${link}">${link}</a>
      `;
      await sendEmail(null, subject, text, html);
    } catch (err) {
      return res.status(400).json({ error: 'Fail Sending email' });
    }

    return res.json({ message: 'Check your email for instructions' });
  }
}

export default new AdminUserPassForgotController();
