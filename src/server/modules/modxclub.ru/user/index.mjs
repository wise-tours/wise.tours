

import PrismaModule from "@prisma-cms/prisma-module";

import UserModule, {
  UserPayload,
} from "@prisma-cms/user-module";

import MergeSchema from 'merge-graphql-schemas';

import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;


export class ModxclubUserProcessor extends UserPayload {


  async signup(source, args, ctx, info) {

    let {
      data: {
        username,
        email,
        password,
      },
    } = args;


    if (!username) {
      this.addFieldError("username", "Не указан логин");
    }

    if (!email) {
      this.addFieldError("email", "Не указан емейл");
    }

    if (!password) {
      this.addFieldError("password", "Не указан пароль");
    }


    return super.signup(null, source, args, ctx, info);
  }


  async mutate(method, args, info) {

    let {
      data: {
        ethWallet,
        ...data
      },
      where,
      ...otherArgs
    } = args;


    const {
      db,
    } = this.ctx;


    if (ethWallet && where) {

      const user = await db.query.user({
        where,
      }, `{
        id
        EthAccounts{
          id
          address
        },
      }`);

      if (!user) {
        return this.addError("Не был получен пользователь");
      }

      const {
        EthAccounts,
      } = user;

      /**
       * Если есть аккаунт, обновляем его.
       * Если нету, создаем новый
       */

      if (EthAccounts && EthAccounts[0]) {

        const {
          id,
        } = EthAccounts[0];

        Object.assign(data, {
          EthAccounts: {
            update: {
              where: {
                id,
              },
              data: {
                address: ethWallet,
              },
            },
          },
        });

      }
      else {

        Object.assign(data, {
          EthAccounts: {
            create: {
              address: ethWallet,
            },
          },
        });

      }

    }


    args = {
      ...otherArgs,
      where,
      data,
    }

    return super.mutate(method, args, info);
  }

}


class ModxclubUserModule extends UserModule {


  // constructor() {

  //   super();

  //   this.mergeModules([
  //     SocialModule,
  //   ]);

  // }

  // getApiSchema(types = []) {


  //   let apiSchema = super.getApiSchema(types, [
  //     "Mutation",

  //     "UserCreateInput",

  //     "ResourceCreateInput",
  //     "ResourceUpdateInput",
  //   ]);


  //   let schema = fileLoader(__dirname + '/schema/api/', {
  //     recursive: true,
  //   });

  //   apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });

  //   return apiSchema;

  // }



  getResolvers() {


    let resolvers = super.getResolvers();

    const {
      Mutation: {
        signup,
        updateUserProcessor,
        ...Mutation
      },
      ...other
    } = resolvers;



    return {
      ...other,
      Mutation: {
        ...Mutation,
        signup: (source, args, ctx, info) => {

          return new ModxclubUserProcessor(ctx).signup(source, args, ctx, info);
        },
        updateUserProcessor: (source, args, ctx, info) => {

          return new ModxclubUserProcessor(ctx).updateWithResponse("User", args, info);
        },
      },
      Subscription: {
        user: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.user({}, info);
          },
        },
      },
    };

  }


}


export default ModxclubUserModule;