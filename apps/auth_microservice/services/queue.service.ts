export abstract class QueueService {
  abstract connect(): Promise<void>;
  abstract sendMessageToQueue(queue: string, message: Record<string, unknown>): Promise<void>;
}
