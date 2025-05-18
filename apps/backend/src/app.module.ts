import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
import { ProductsService } from './products/products.service';

import { AppController } from './app.controller';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [ConfigModule],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatService, ProductsService],
})
export class AppModule {}
