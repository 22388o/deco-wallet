/* eslint-disable class-methods-use-this */
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import User from '../entities/User';
import ErrorHelpers from '../controllers/helpers/error-helpers';
import { MyContext } from '../types';
import UserController from '../controllers/user.controller';
import { UsernamePasswordInput, UserResponse } from './types/user.types';
import { isAuth } from '../middlewares/isAuth';

@Resolver()
export default class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() ctx: MyContext): Promise<User | null> {
    return UserController.getUser(ctx.req.session.userId);
  }

  @UseMiddleware(isAuth)
  @Query(() => Number, { nullable: false })
  balance(@Ctx() { req }: MyContext): Promise<number> {
    return UserController.getBalance(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(@Arg('input') input: UsernamePasswordInput, @Ctx() { req }: MyContext): Promise<UserResponse> {
    try {
      const { errors, user } = await UserController.signup(input);

      if (user) {
        // eslint-disable-next-line no-param-reassign
        req.session.userId = user.id;
      }

      return { user, errors };
    } catch (error) {
      return ErrorHelpers.handleErrors(error);
    }
  }

  @Mutation(() => UserResponse)
  async login(@Arg('input') input: UsernamePasswordInput, @Ctx() { req }: MyContext): Promise<UserResponse> {
    try {
      const { errors, user } = await UserController.login(input);

      if (user) {
        // eslint-disable-next-line no-param-reassign
        req.session.userId = user.id;
      }

      return { user, errors };
    } catch (error) {
      return ErrorHelpers.handleErrors(error);
    }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req }: MyContext): boolean {
    // eslint-disable-next-line no-param-reassign
    req.session.userId = undefined;

    return true;
  }
}
