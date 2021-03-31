import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { format } from 'date-fns'

import { ICreateComment } from "src/@types";
import { User } from "src/user/user.model";
import { Comment } from './comment.model'

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment)
    private readonly commentModel: typeof Comment
  ) { }

  async store(user: User, body: ICreateComment) {
    const publishedIn = format(new Date(), 'dd-MM-yyyy HH:mm:ss')

    if (body.isAnonimous) body.name = null
    if (!body.isAnonimous && body.name) body.name
    if (!body.isAnonimous && !body.name && !user) throw new HttpException("Insira seu nome, por favor!", 406)

    const comment = await this.commentModel.create({
      ...body,
      publishedIn,
      userId: user && user.id
    })

    return { comment, message: "Comentário criado com sucesso!" }
  }

  async delete(id: number) {
    const comment = await this.commentModel.findByPk(id)

    if (!comment) throw new HttpException("Comentário não encontrado!", 404)

    await comment.destroy({ force: true })

    return { message: "Comentário deletado com sucesso!" }
  }
}