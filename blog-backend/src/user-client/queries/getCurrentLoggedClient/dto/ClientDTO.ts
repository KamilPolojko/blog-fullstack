import { ApiProperty } from '@nestjs/swagger';
import { fillUpProfileDTO } from '../../../commands/fillProfileClient/dto/fill-profile.dto';

export class ClientDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Yardenn' })
  username: string;

  @ApiProperty({ type: () => fillUpProfileDTO, required: false })
  profile?: fillUpProfileDTO & { linkIImage: string };
}
