

import PrismaModule from "@prisma-cms/prisma-module";

import SocietyModule from "@prisma-cms/society-module";

import UserModule from "./user";
import ResourceModule from "./resource";
import BlogModule from "./blog";

import MergeSchema from 'merge-graphql-schemas';

import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;

class ModxclubModule extends PrismaModule {


  constructor(options) {

    super(options);

    this.mergeModules([
      SocietyModule,
      UserModule,
      ResourceModule,
      BlogModule,
    ]);

  }


  getSchema(types = []) {

    let schema = fileLoader(__dirname + '/schema/database/', {
      recursive: true,
    });


    if (schema) {
      types = types.concat(schema);
    }


    let typesArray = super.getSchema(types);

    return typesArray;

  }
  

  getApiSchema(types = []) {


    let apiSchema = super.getApiSchema(types, [
      "Mutation",

      "UserCreateInput",
      "UserUpdateInput",

      "ResourceCreateInput",
      "ResourceUpdateInput",

      "UserCreateOneWithoutResourcesInput",

    ]);


    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });

    return apiSchema;

  }



  getResolvers() {


    let resolvers = super.getResolvers();

    const {
      Mutation,
      ...other
    } = resolvers;


    const {
      signin,
      signup,
      // createResourceProcessor,
      updateUserProcessor,
      createBlogProcessor,
      createTopicProcessor,
      createCommentProcessor,
      singleUpload,
      multipleUpload,
    } = Mutation;

    return {
      Mutation: {
        signin,
        signup,
        // createResourceProcessor,
        updateUserProcessor,
        createBlogProcessor,
        createTopicProcessor,
        createCommentProcessor,
        singleUpload,
        multipleUpload,
      },
      ...other,
    };

  }


}


export default ModxclubModule;