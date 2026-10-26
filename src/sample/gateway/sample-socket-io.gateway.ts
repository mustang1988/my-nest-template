import {
  OnGatewayInit,
  type WsResponse,
  ConnectedSocket,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { AutoContextLogger } from 'src/logger/auto-context-logger';
import { ESampleWebSocketEvent } from '../enum/sample-websocket-event.enum';

/**
 * 基于Socket.IO的WebSocket示例
 */
@WebSocketGateway({ namespace: 'sample', transports: ['websocket'] })
export class SampleSocketIoGateway extends AutoContextLogger implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>, OnGatewayInit<Namespace> {
  @WebSocketServer()
  namespace: Namespace;

  afterInit(server: Namespace) {
    this.logger.info('afterInit: namespace = %s', server.name);
  }

  handleDisconnect(client: Socket) {
    this.logger.info('handleDisconnect: client = %s', client.id);
  }

  handleConnection(client: Socket) {
    this.logger.info('handleConnection: client = %s', client.id);
  }

  /**
   * 通过返回值方式响应WS事件
   */
  @SubscribeMessage(ESampleWebSocketEvent.PING)
  handlePing(): WsResponse<{ timestamp: number }> {
    return { event: ESampleWebSocketEvent.PONG, data: { timestamp: Date.now() } };
  }

  /**
   * 通过emit方式响应WS事件
   * @param client 客户端连接
   */
  @SubscribeMessage(ESampleWebSocketEvent.PING)
  handlePing2(@ConnectedSocket() client: Socket): void {
    client.emit(ESampleWebSocketEvent.PONG, { timestamp: Date.now() });
  }
}
