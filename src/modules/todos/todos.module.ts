import { AuthModule } from './../auth/auth.module';
import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports: [DatabaseModule, AuthModule],
})
export class TodosModule {}
