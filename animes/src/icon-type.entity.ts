import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IconType {
  @Field()
  type: string;
}
