import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service.js";

@Injectable()
export class ExceptionErros {
  constructor(
    private readonly prismaService: PrismaService
  ){}
 async execptionErros(userId: string){
      const isUser = await this.prismaService.user.findUnique({
      where :{
        id: userId,
      }
    });

    if(!isUser) {
      throw new NotFoundException("Este usuário não existe!\nTente novamente");
    }
  }

  
}
