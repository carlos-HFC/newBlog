import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";

import { ICreateUser, IUpdateUser } from "src/@types";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/role.guard";
import { Role } from "src/auth/roles.decorator";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService
  ) { }

  @Role('author')
  @Get()
  async index(@Query('role') role: string) {
    return await this.userService.getAll(role)
  }

  @Role('author', 'reader')
  @Get('/profile')
  async profile(@Req() req: Request) {
    return req.user
  }

  @Role('author')
  @Get('/inactive')
  async inactives(@Query('role') role?: string) {
    return await this.userService.getInactives(role)
  }

  @Role('author')
  @Post()
  async store(@Body() body: ICreateUser) {
    return await this.userService.store(body, true)
  }

  @Role('author', 'reader')
  @Patch()
  async update(@Body() body: IUpdateUser, @Req() req: Request) {
    return await this.userService.update(req.user, body)
  }

  @Role('author')
  @Patch('/inactive/:id')
  async reactive(@Param('id') id: number) {
    return await this.userService.reactive(id)
  }

  @Role('author')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id)
  }
}