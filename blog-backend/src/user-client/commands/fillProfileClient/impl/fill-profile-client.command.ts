import { fillUpProfileDTO } from '../dto/fill-profile.dto';

export class FillProfileClientCommand {
  constructor(
    public readonly fillProfileDTO: fillUpProfileDTO,
    public readonly file: Express.Multer.File,
  ) {}
}
