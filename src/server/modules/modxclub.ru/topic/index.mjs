

// import PrismaModule from "@prisma-cms/prisma-module";

import ResourceModule, {
  // UserPayload,
} from "@prisma-cms/resource-module";

import MergeSchema from 'merge-graphql-schemas';

import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;


// export class ModxclubTopicProcessor extends UserPayload{

   

// }


class ModxclubTopicModule extends ResourceModule {


  // constructor() {

  //   super();

  //   this.mergeModules([
  //     SocialModule,
  //   ]);

  // }

  getApiSchema(types = []) {


    let apiSchema = super.getApiSchema(types, [
    ]);


    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    // console.log("schema", schema);

    apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });

    // console.log("apiSchema", apiSchema);

    return apiSchema;

  }



  // getResolvers() {


  //   let resolvers = super.getResolvers();

  //   const {
  //     Mutation: {
  //       signup,
  //       ...Mutation
  //     },
  //     ...other
  //   } = resolvers;

 

  //   return {
  //     Mutation: {
  //       ...Mutation,
  //       signup: (source, args, ctx, info) => {

  //         return new ModxclubTopicProcessor(ctx).signup(source, args, ctx, info);
  //       },
  //     },
  //     ...other,
  //   };

  // }


}


export default ModxclubTopicModule;