import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('ChatBot')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  @ApiOperation({ summary: 'Gets user message and Returns LLM response' })
  @ApiBody({ type: ChatRequestDto, })
  async chat(@Body() body: ChatRequestDto) {
    return { response: await this.chatService.chatWithTools(body.message) };
  }
}
