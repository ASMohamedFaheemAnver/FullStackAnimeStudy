import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import Constants from './constants';

@Injectable()
export class AppService {
  private pubSub: PubSub;
  constructor() {
    this.pubSub = new PubSub();
  }
  getChatIconEmits() {
    console.log({ emit: 'getChatIconEmits' });
    // setInterval(() => {
    //   this.pubSub.publish(Constants.EMIT_CHAT_ICON_SUBSCRIPTION_NAME, {
    //     getChatIconEmits: { type: 'heart' },
    //   });
    // }, 1000);
    return this.pubSub.asyncIterator(
      Constants.EMIT_CHAT_ICON_SUBSCRIPTION_NAME,
    );
  }

  emitChatIcon(type: String) {
    console.log({ emit: 'emitChatIcon' });
    this.pubSub.publish(Constants.EMIT_CHAT_ICON_SUBSCRIPTION_NAME, {
      getChatIconEmits: { type: type },
    });
    return true;
  }
}
