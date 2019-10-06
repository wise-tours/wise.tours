
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class UserTechnologyProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "UserTechnology";

    this.private = true;
    this.ownable = true;
  }


  async create(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.create(method, args, info);
  }


  async update(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.update(method, args, info);
  }


  async mutate(method, args, info) {

    const {
      db,
      currentUser,
    } = this.ctx;

    const {
      id: currentUserId,
    } = currentUser || {};

    if (args.data) {

      let {
        Technology,
        ...data
      } = args.data;


      if (Technology !== undefined) {

        const {
          connect,
        } = Technology;

        /**
         * Проверяем, чтобы у пользователя была только одна запись на одну технологию
         */
        if (connect) {

          const exist = await db.exists.UserTechnology({
            Technology: {
              ...connect,
            },
            CreatedBy: {
              id: currentUserId,
            },
          });

          // console.log("currentUserId", currentUserId);
          // console.log("exist", exist);

          if (exist) {
            this.addError("Данная технология уже указана у пользователя");
          }

        }

      }


      Object.assign(data, {
        Technology,
      });

      args.data = data;

    }

    return super.mutate(method, args);
  }



  async delete(method, args, info) {

    return super.delete(method, args);
  }
}


export default class UserTechnologyModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return UserTechnologyProcessor;
  }


  getResolvers() {

    const {
      Query: {
        ...Query
      },
      Subscription: {
        ...Subscription
      },
      Mutation: {
        ...Mutation
      },
      ...other
    } = super.getResolvers();

    return {
      ...other,
      Query: {
        ...Query,
        userTechnology: (source, args, ctx, info) => {
          return ctx.db.query.userTechnology(args, info);
        },
        userTechnologies: (source, args, ctx, info) => {
          return ctx.db.query.userTechnologies(args, info);
        },
        userTechnologiesConnection: (source, args, ctx, info) => {
          return ctx.db.query.userTechnologiesConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        createUserTechnologyProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).createWithResponse("UserTechnology", args, info);
        },
        updateUserTechnologyProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("UserTechnology", args, info);
        },
        deleteUserTechnology: (source, args, ctx, info) => {
          return this.getProcessor(ctx).delete("UserTechnology", args, info);
        },
      },
      Subscription: {
        ...Subscription,
        userTechnology: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.userTechnology({}, info);
          },
        },
      },
      UserTechnologyResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.userTechnology({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}