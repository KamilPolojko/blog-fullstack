import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClientsQuery } from '../impl/get-clients.query';
import { Client } from '../../../entities/client.entity';
import { ClientService } from '../../../client.service';

@QueryHandler(GetClientsQuery)
export class GetClientsQueryHandler implements IQueryHandler<GetClientsQuery> {
  constructor(private readonly clientService: ClientService) {}

  async execute(): Promise<Client[]> {
    return this.clientService.findAll();
  }
}
