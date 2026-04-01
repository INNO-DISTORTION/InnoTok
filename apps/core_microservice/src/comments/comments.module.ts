import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from '../database/entities/comment.entity';
import { CommentLike } from '../database/entities/comment-like.entity';
import { ProfilesModule } from '../profiles/profiles.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '../constants/services';
import { AuthModule } from '../auth/auth.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentLike]),
    ProfilesModule,
    AuthModule,
    NotificationsModule,
    PostsModule,
    ClientsModule.register([
      {
        name: NOTIFICATIONS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'notifications_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
