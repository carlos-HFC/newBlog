import { Body, Controller, Delete, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";

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
  async store(@Body() body: ICreateComment, @Req() req: Request) {
    return await this.commentService.store(req.user, body)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('author')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.commentService.delete(id)
  }
}