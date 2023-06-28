import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './modules/database/prisma.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TodosModule } from './modules/todos/todos.module';


@Module({
  imports: [AuthModule, UsersModule, TodosModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
