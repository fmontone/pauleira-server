import jwt from 'jsonwebtoken';

import AdminUser from '../models/AdminUser';
import adminUserActivateConfig from '../../config/adminUserActivateConfig';
import sendEmail from '../../config/nodeMailer';

class AdminUserActivateController {
  async update(req, res) {
    const { email } = req.body;
    const { reset } = req.query;

    console.log('>>> RESET >>>', reset);

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
      const action = reset ? 'reset' : 'activate';
      const link = `${process.env.CLIENT_ADMIN_URL}/admin-users/${action}/${id}/${token}`;
      const subject = reset ? 'Recupere sua Senha' : 'Ative Sua Conta';
      const text = reset
        ? `
          Clique no link abaixo - ou copie e cole o código do link em seu navegador -  para recuperar sua senha na área administrativa da Pauleira:
          ${link}
        `
        : `
          Seu email foi adicionado como Usuário Administrativo no site da Pauleira. Clique no link abaixo - ou copie e cole o código do link em seu navegador - para ativar sua conta:
          ${link}
        `;
      const html = reset
        ? `
          <h2>Recupere sua senha</h2>
          <p>Clique no link abaixo - ou copie e cole o código do link em seu navegador -  para recuperar sua senha na área administrativa da Pauleira:</p>
          <a href="${link}">${link}</a>
      `
        : `
        <h2>Instruções para ativação</h2>
        Seu email foi adicionado como Usuário Administrativo no site da Pauleira. Clique no link abaixo - ou copie e cole o código do link em seu navegador - para ativar sua conta:
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

export default new AdminUserActivateController();
