const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError');
const sqliteConnection = require('../database/sqlite');

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get('SELECT * FROM users WHERE email = (?)', [email]);

    if(checkUserExists) {
      throw new AppError("Esse Email já está cadastrado");
    }

    const hashedPassword = await hash(password, 8);

    await database.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
    [name, email, hashedPassword]);

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, oldPassword } = req.body;
    const user_id = req.user.id;

    const database = await sqliteConnection();
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [user_id]);

    if(!user){
      throw new AppError('Usuário não encontrado')
    }

    const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      throw new AppError('Email já está em uso');
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !oldPassword){
      throw new AppError('Você precisa digitar sua senha atual')
    }

    if(password && oldPassword){
      const checkOldPassword = await compare(oldPassword, user.password)

      if(!checkOldPassword){
        throw new AppError('Senha atual inválida')
      }

      user.password = await hash(password, 8)
    }

    await database.run(`
      UPDATE users SET 
      name = ?, 
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    return res.status(200).json();
  }
}

module.exports = UsersController;