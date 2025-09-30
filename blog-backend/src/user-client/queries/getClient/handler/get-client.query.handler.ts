import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ClientService } from '../../../client.service';
import { GetClientQuery } from '../impl/get-client.query';
import { Client } from '../../../entities/client.entity';

@QueryHandler(GetClientQuery)
export class GetClientQueryHandler implements IQueryHandler<GetClientQuery> {
  constructor(private readonly clientService: ClientService) {}

  async execute(query: GetClientQuery): Promise<Client | null> {
    return this.clientService.findFullUserById(query.clientId);
  }
}
