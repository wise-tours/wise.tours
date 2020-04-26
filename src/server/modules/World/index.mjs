
import PrismaModule from "@prisma-cms/prisma-module";
// import PrismaProcessor from "@prisma-cms/prisma-processor";

import CountryModule from "./Country";
import GeoObjectTypeModule from "./GeoObjectType";
import GeoObjectModule from "./GeoObject";

import MergeSchema from 'merge-graphql-schemas';
import path from 'path';
const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);
const { fileLoader, mergeTypes } = MergeSchema;


export default class WorldModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
      CountryModule,
      GeoObjectTypeModule,
      GeoObjectModule,
    ]);

  }


  getSchema(types = []) {

    let schema = super.getSchema(types);

    let customSchema = fileLoader(__dirname + '/schema/database/', {
      recursive: true,
    });

    if (customSchema) {
      schema = mergeTypes([schema].concat(customSchema), { all: true });
    }

    return schema;
  }



  getApiSchema() {

    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    return schema;
  }

}