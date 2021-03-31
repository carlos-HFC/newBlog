import { Body, Controller, HttpCode, Post } from "@nestjs/common";

import { ICreateUser, ILogin } from "src/@types";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: ILogin) {
    return await this.authService.login(body)
  }

  @Post('register')
  async register(@Body() body: ICreateUser) {
    return await this.authService.register(body)
  }
}