import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())

    if (!roles) return true

    const { user } = context.switchToHttp().getRequest() as Request

    const hasRole = () => roles.find(item => item === user.role)

    if (!hasRole()) throw new HttpException("Você não tem permissão!", 403)

    return user && true
  }
}