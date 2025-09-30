import { AddCommentDTO } from '../dto/AddCommentDTO';

export class AddCommentCommand {
  constructor(public readonly commentDTO: AddCommentDTO) {}
}
