import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatRequestDto {
  @ApiProperty({
    description: 'The message to send to the chatbot',
    example: 'How many Canadian Dollars are 350 Euros',
  })
  @IsString()
  message: string;
}
