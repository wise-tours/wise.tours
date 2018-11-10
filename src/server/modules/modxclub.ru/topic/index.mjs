

// import PrismaModule from "@prisma-cms/prisma-module";

import ResourceModule, {
  ResourceProcessor,
} from "@prisma-cms/resource-module";

import MergeSchema from 'merge-graphql-schemas';

import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;


export class ModxclubResourceProcessor extends ResourceProcessor {


  async create(method, args, info) {

    let {
      data: {
        blogID,
        ...data
      },
    } = args;


    let {
      type,
    } = data;


    switch(type){

      case "Topic":
  
        if(!blogID){
          return this.addError("Не был указан ID блога");
        }
        else {
          Object.assign(data, {
            Parent: {
              connect: {
                id: blogID,
              },
            },
          });
        }

        break;

    }

    // let uriData = await this.prepareUri(args);

    // Object.assign(data, {
    //   ...uriData,
    //   ...this.getCreatedBy(),
    // });


    Object.assign(args, {
      data,
    });

    // return this.addFieldError("test", "error");

    return super.create(method, args, info);
  }

}


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



  getResolvers() {


    let resolvers = super.getResolvers();

    const {
      Mutation: {
        ...Mutation
      },
      ...other
    } = resolvers;



    return {
      Mutation: {
        ...Mutation,
        createTopicProcessor: (source, args, ctx, info) => {
      
          Object.assign(args.data, {
            type: "Topic",
          });

          return this.getProcessor(ctx).createWithResponse("Resource", args, info);
        }
      },
      ...other,
    };

  }


  getProcessorClass() {
    return ModxclubResourceProcessor;
  }

}


export default ModxclubTopicModule;