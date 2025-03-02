import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { NotificationDetail } from 'src/common/interfaces';
import { Message } from 'src/schemas/message.schema';

@WebSocketGateway({ cors: true })
@Injectable()
export class NotificationGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private users: { [key: string]: Socket } = {};

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    this.users[userId] = socket;
    console.log(`User connected: ${userId}`);
  }

  handleDisconnect(socket: Socket) {
    const userId = Object.keys(this.users).find(
      (id) => this.users[id].id === socket.id,
    );
    if (userId) {
      delete this.users[userId];
      console.log(`User disconnected: ${userId}`);
    }
  }

  sendNotification(userId: string, notification: NotificationDetail) {
    const socket = this.users[userId];
    if (socket) {
      socket.emit('notification', notification); // Send notification to specific user
    }
  }

  sendGlobalNotification(message: string) {
    for (const userId in this.users) {
      this.users[userId].emit('notification', message);
    }
  }

  sendMessageNotification(userId: string, message: Message) {
    const socket = this.users[userId];
    if (socket) {
      socket.emit('mess', message); // Send notification to specific user
    }
  }
}
