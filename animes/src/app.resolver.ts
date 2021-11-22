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

  @Subscription((_) => IconType, {
    filter: (payload, variables) => {
      console.log({ payload, variables });
      return true;
    },
    resolve: (payload, args, context, info) => {
      console.log({ payload, args /*context, info*/ });
      return payload.getChatIconEmits;
    },
  })
  getChatIconEmits(@Args('env') env: String) {
    return this.appService.getChatIconEmits();
  }

  @Mutation((_) => Boolean)
  emitChatIcon(@Args('type') type: String) {
    return this.appService.emitChatIcon(type);
  }
}
