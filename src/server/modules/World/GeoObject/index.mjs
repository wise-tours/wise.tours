
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class GeoObjectProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "GeoObject";
  }


  async create(method, args, info) {

    if(args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.create(method, args, info);
  }


  async update(method, args, info) {

    if(args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.update(method, args, info);
  }


  async mutate(method, args, info) {

    if(args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.mutate(method, args);
  }



  async delete(method, args, info) {

    return super.delete(method, args);
  }
}


export default class GeoObjectModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return GeoObjectProcessor;
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
        geoObject: (source, args, ctx, info) => {
          return ctx.db.query.geoObject(args, info);
        },
        geoObjects: (source, args, ctx, info) => {
          return ctx.db.query.geoObjects(args, info);
        },
        geoObjectsConnection: (source, args, ctx, info) => {
          return ctx.db.query.geoObjectsConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        createGeoObjectProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).createWithResponse("GeoObject", args, info);
        },
        updateGeoObjectProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("GeoObject", args, info);
        },
        deleteGeoObject: (source, args, ctx, info) => {
          return this.getProcessor(ctx).delete("GeoObject", args, info);
        },
      },
      Subscription: {
        ...Subscription,
        geoObject: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.geoObject({}, info);
          },
        },
      },
      GeoObjectResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.geoObject({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}