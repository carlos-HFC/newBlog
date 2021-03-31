import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { ICreateUser, ILogin } from "src/@types";
import { User } from "src/user/user.model";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  async login(body: ILogin) {
    const { username, password } = body

    const user = await this.userService.getUser(username.trim())

    if (!user || !(await user.checkPass(password.trim()))) throw new HttpException("As credencias estão incorretas!", 401)

    const token = this.createToken(user)

    const { exp } = await this.jwtService.verifyAsync(token)

    return { user, access: { token, expiresIn: exp * 1000 } }
  }

  async validate(payload: { nickname: string }) {
    const user = await this.userService.getUser(payload.nickname)

    return user
  }

  async register(body: ICreateUser) {
    return await this.userService.store(body, false)
  }

  private createToken(user: User) {
    // const token = this.jwtService.sign({ id: user.id, email: user.email, nickname: user.nickname })
    // const x = this.jwtService.verify(token)
    // return x.exp
    return this.jwtService.sign({ id: user.id, email: user.email, nickname: user.nickname })
  }
}