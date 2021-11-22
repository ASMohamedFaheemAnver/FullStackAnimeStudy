import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (connectionParams, webSocket, context) => {
            console.log({ connectionParams });
          },
          onDisconnect: (webSocket, context) => {
            console.log({ context });
          },
        },
      },
    }),
  ],
  controllers: [],
  providers: [AppService, AppResolver],
})
export class AppModule {}
