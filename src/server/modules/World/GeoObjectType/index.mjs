
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class GeoObjectTypeProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "GeoObjectType";

    this.private = true;
  }


  async create(method, args, info) {

    if (args.data) {

      let {
        name = "",
        ...data
      } = args.data;


      Object.assign(data, {
        name,
      });

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

    if (args.data) {

      let {
        name,
        ...data
      } = args.data;

      if (name !== undefined) {
        name = name ? name.trim() : null;

        if (!name) {
          this.addFieldError("name", "Не заполнено название");
        }
      }

      Object.assign(data, {
        name,
      });

      console.log('data', JSON.stringify(data, true, 2));

      args.data = data;

    }

    return super.mutate(method, args);
  }



  async delete(method, args, info) {

    return super.delete(method, args);
  }
}


export default class GeoObjectTypeModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return GeoObjectTypeProcessor;
  }


  getResolvers() {

    const {
      Query: {
        ...Query
      },
      Subscription,
      Mutation: {
        ...Mutation
      },
      ...other
    } = super.getResolvers();

    return {
      ...other,
      Query: {
        ...Query,
        geoObjectType: (source, args, ctx, info) => {
          return ctx.db.query.geoObjectType(args, info);
        },
        geoObjectTypes: (source, args, ctx, info) => {
          return ctx.db.query.geoObjectTypes(args, info);
        },
        geoObjectTypesConnection: (source, args, ctx, info) => {
          return ctx.db.query.geoObjectTypesConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        createGeoObjectTypeProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).createWithResponse("GeoObjectType", args, info);
        },
        updateGeoObjectTypeProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("GeoObjectType", args, info);
        },
        deleteGeoObjectType: (source, args, ctx, info) => {
          return this.getProcessor(ctx).delete("GeoObjectType", args, info);
        },
      },
      // Subscription: {
      //   ...Subscription,
      //   geoObjectType: {
      //     subscribe: async (parent, args, ctx, info) => {

      //       return ctx.db.subscription.geoObjectType({}, info);
      //     },
      //   },
      // },
      GeoObjectTypeResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.geoObjectType({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}