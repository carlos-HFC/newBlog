import { Body, Controller, Delete, Param, Post, UseGuards } from "@nestjs/common";

import { ICreateComment } from "src/@types";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/role.guard";
import { Role } from "src/auth/roles.decorator";
import { CommentService } from "./comment.service";

@Controller('comments')
export class CommentController {
  constructor(
    private commentService: CommentService
  ) { }

  @Post()
  async store(@Body() body: ICreateComment) {
    return await this.commentService.store(body)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('author')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.commentService.delete(id)
  }
}