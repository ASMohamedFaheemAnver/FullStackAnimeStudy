import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { AppService } from './app.service';
import Constants from './constants';
import { IconType } from './icon-type.entity';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query((_) => String)
  _() {
    console.log({ emit: '_' });
    return Constants.ENVIRONMENT;
  }

  @Subscription((_) => IconType)
  getChatIconEmits() {
    return this.appService.getChatIconEmits();
  }

  @Mutation((_) => Boolean)
  emitChatIcon(@Args('type') type: String) {
    return this.appService.emitChatIcon(type);
  }
}
