import * as amqp from 'amqplib';
import { QueueService } from './queue.service';

export class RabbitMQService extends QueueService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async connect(): Promise<void> {
    try {
      const host = process.env.RABBITMQ_HOST || 'localhost';
      const port = process.env.RABBITMQ_PORT || '5672';
      const url = `amqp://${host}:${port}`;

      console.log(`RabbitMQ connecting to ${url}...`);

      this.connection = await amqp.connect(url);// Establishing a connection to the message broker

      if (!this.connection) {
        throw new Error('Connection failed to initialize');
      }

      this.channel = await this.connection.createChannel();

      if (!this.channel) {
        throw new Error('Channel failed to initialize');
      }

      console.log('RabbitMQ connected.');
    } catch (error) {
      console.error('RabbitMQ connection failed:', error);
    }
  }

  async sendMessageToQueue(queue: string, message: Record<string, unknown>): Promise<void> {
    if (!this.channel) {
      console.warn('RabbitMQ channel not ready, attempting to connect...');
      await this.connect();
    }

    if (!this.channel) {
      console.error('RabbitMQ failed to send message: Channel is still null');
      return;
    }

    // assertQueue with { durable: true } is idempotent — if the queue already exists
    // with the same parameters, it simply confirms it. If params differ, an error is thrown.
    await this.channel.assertQueue(queue, { durable: true });

    const payload = JSON.stringify(message);
    this.channel.sendToQueue(queue, Buffer.from(payload), {
      persistent: true,// persistent=true ensures that the message will be written to disk and will not be lost if the broker fails
    });
  }
}
