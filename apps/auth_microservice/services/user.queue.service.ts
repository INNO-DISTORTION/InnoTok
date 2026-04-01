import { QueueService } from './queue.service';

// Queue name for synchronizing users between Auth and other services
const USER_SYNC_QUEUE = 'user_sync_queue';

export class UserQueueService {
  constructor(private readonly queueService: QueueService) {}

  async publishUserCreated(user: Record<string, unknown>): Promise<void> {
    await this.queueService.sendMessageToQueue(USER_SYNC_QUEUE, user);
    console.log(`RabbitMQ sent user_created event for user: ${String(user.email)}`);
  }
}
