

import PrismaModule from "@prisma-cms/prisma-module";

import SocialModule from "@prisma-cms/social-module";

import UserModule from "./user";

import MergeSchema from 'merge-graphql-schemas';

import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;

class ModxclubModule extends PrismaModule {


  constructor(options) {

    super(options);

    this.mergeModules([
      SocialModule,
      UserModule,
    ]);

  }

  getApiSchema(types = []) {


    let apiSchema = super.getApiSchema(types, [
      "Mutation",

      "UserCreateInput",
      "UserUpdateInput",

      "ResourceCreateInput",
      "ResourceUpdateInput",

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
      createResourceProcessor,
      updateUserProcessor,
      singleUpload,
      multipleUpload,
    } = Mutation;
    
    return {
      Mutation: {
        signin,
        signup,
        createResourceProcessor,
        updateUserProcessor,
        singleUpload,
        multipleUpload,
      },
      ...other,
    };

  }


}


export default ModxclubModule;