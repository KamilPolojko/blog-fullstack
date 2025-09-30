import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ClientService } from '../../../client.service';
import { GetCurrentLoggedClientQuery } from '../impl/get-current-logged-client.query';
import { Client } from '../../../entities/client.entity';

@QueryHandler(GetCurrentLoggedClientQuery)
export class GetCurrentLoggedClientQueryHandler
  implements IQueryHandler<GetCurrentLoggedClientQuery>
{
  constructor(private readonly clientService: ClientService) {}

  async execute(query: GetCurrentLoggedClientQuery): Promise<Client | null> {
    return this.clientService.findFullUserById(query.clientId);
  }
}
