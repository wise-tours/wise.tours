
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class CountryProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "Country";
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


export default class CountryModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return CountryProcessor;
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
        country: (source, args, ctx, info) => {
          return ctx.db.query.country(args, info);
        },
        countries: (source, args, ctx, info) => {
          return ctx.db.query.countries(args, info);
        },
        countriesConnection: (source, args, ctx, info) => {
          return ctx.db.query.countriesConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        createCountryProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).createWithResponse("Country", args, info);
        },
        updateCountryProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("Country", args, info);
        },
        deleteCountry: (source, args, ctx, info) => {
          return this.getProcessor(ctx).delete("Country", args, info);
        },
      },
      Subscription: {
        ...Subscription,
        country: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.country({}, info);
          },
        },
      },
      CountryResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.country({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}