import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op as $ } from 'sequelize'

import { ICreateUser, IUpdateUser } from "../@types";
import { User } from "./user.model";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User
  ) { }

  async getAll(role: string) {
    if (role) {
      return await this.userModel.findAll({
        attributes: { exclude: ['hash'] },
        where: { role }
      })
    }

    return await this.userModel.findAll({
      attributes: { exclude: ['hash'] },
    })
  }

  async getInactives(role: string) {
    if (role) {
      return await this.userModel.scope("inactives").findAll({ where: { role } })
    }

    return await this.userModel.scope("inactives").findAll()
  }

  async getUser(username: string) {
    return await this.userModel.findOne({
      where: {
        [$.or]: [
          { email: username },
          { nickname: username },
        ]
      }
    })
  }

  async getById(id: number) {
    return await this.userModel.findByPk(id)
  }

  async getByEmail(email: string) {
    return await this.userModel.findOne({ where: { email } })
  }

  async getByNickname(nickname: string) {
    return await this.userModel.findOne({ where: { nickname } })
  }

  async store(body: ICreateUser, author?: boolean) {
    const { name, email, nickname, password, confirmPass } = body

    const required = [email, name, nickname]
    if (required.some(item => !item)) throw new HttpException("As credenciais são obrigatórias", 401)

    const exists = await Promise.all([
      this.getByEmail(email.trim()),
      this.getByNickname(nickname.trim())
    ])
    if (exists[0] || exists[1]) throw new HttpException("Esse usuário já existe", 401)

    if (author) {
      const { id, role } = await this.userModel.create({
        ...body,
        role: 'author',
        password: '12345678'
      })

      return {
        user: {
          id, name, email, role, nickname
        },
        message: "A conta do autor foi criada com sucesso!"
      }
    }

    if (password.length < 8) throw new HttpException("Senha deve ter pelo menos 8 caracteres", 406)

    if (password && !confirmPass) throw new HttpException("Confirmação de senha é obrigatória", 401)

    if (password !== confirmPass) throw new HttpException("As senhas não correspondem", 401)

    const { id, role } = await this.userModel.create({
      ...body,
      role: 'reader'
    })

    return {
      user: {
        id, name, email, role, nickname
      },
      message: "Sua conta foi criada com sucesso!"
    }
  }

  async update(user: User, body: IUpdateUser) {
    const { nickname, email, oldPass, password, confirmPass } = body

    if (email && email !== user.email) {
      if (await this.getByEmail(email.trim())) throw new HttpException("Esse usuário já existe", 401)
    }

    if (nickname && nickname !== user.nickname) {
      if (await this.getByNickname(nickname.trim())) throw new HttpException("Esse usuário já existe", 401)
    }

    if (oldPass) {
      if (!(await user.checkPass(oldPass))) throw new HttpException("Senha atual incorreta", 401)

      if (oldPass === password) throw new HttpException("Nova senha não pode ser igual a senha atual", 401)

      if (password.length < 8) throw new HttpException("Senha deve ter pelo menos 8 caracteres", 406)

      if (password && !confirmPass) throw new HttpException("Confirmação de senha é obrigatória", 401)

      if (password !== confirmPass) throw new HttpException("As senhas não correspondem", 401)
    }

    await user.update(body)

    return { message: "Sua conta foi atualizada com sucesso!" }
  }

  async delete(id: number) {
    const user = await this.getById(id)

    if (!user) throw new HttpException("Usuário não encontrado!", 404)

    await user.destroy()

    return { message: "Conta desativada com sucesso!" }
  }

  async reactive(id: number) {
    const user = await this.userModel.scope("inactives").findByPk(id)

    if (!user) throw new HttpException("Usuário não encontrado!", 404)

    await user.restore()

    return { message: "Usuário ativo com sucesso!" }
  }
}