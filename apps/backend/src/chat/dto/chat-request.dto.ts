import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatRequestDto {
    @ApiProperty({
        description: 'The message to send to the chatbot',
        example: 'Find me red shoes under $100',
    })
    @IsString()
    message: string;
}
