import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private client!: ClientProxy;

  async onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL as string],
        queue: 'email_queue',
      },
    });
    await this.client.connect();
  }

  async sendEmail(to: string, subject: string, text: string) {
    await firstValueFrom(this.client.emit('send_email', { to, subject, text }));
  }
}
