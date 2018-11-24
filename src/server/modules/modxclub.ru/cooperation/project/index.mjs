

import chalk from "chalk";

import ProjectModule, {
  ProjectProcessor,
} from "@prisma-cms/cooperation-module/src/modules/project";


import {
  ResourceProcessor,
} from "@prisma-cms/resource-module";


export class ModxclubProjectProcessor extends ProjectProcessor {


  async create(method, args, info) {

    const {
      ctx,
    } = this;

    let {
      data: {
        name,
        ...data
      },
    } = args;

    name = name && name.trim() || "";


    const resourceProcessor = new ResourceProcessor(ctx);

    let resourceData = {
      type: "Project",
      name,
      uri: `/projects/${name}`,
    };

    let resourceUriData = await resourceProcessor.prepareUri({
      data: resourceData,
    });


    console.log(chalk.green("resourceUriData"), resourceUriData);

    const Resource = {
      create: {
        ...resourceUriData,
        name,
        ...this.getCreatedBy(),
      },
    }


    Object.assign(data, {
      name,
      Resource,
    });




    Object.assign(args, {
      data,
    });


    return super.create(method, args, info);
  }


  async update(method, args, info) {

    const {
      ctx,
    } = this;

    let {
      data: {
        name,
        ...data
      },
    } = args;


    let Resource;

    if (name !== undefined) {

      name = name && name.trim() || "";

      if (!name) {
        name = undefined;
      }
      else {
        Resource = {
          update: {
            name,
          },
        }
      }

    }




    Object.assign(data, {
      name,
      Resource,
    });


    Object.assign(args, {
      data,
    });


    return super.update(method, args, info);
  }


  async mutate(method, args, info) {

    // this.addFieldError("sdfdsF", "Test dsfdsfdsf");

    // console.log(chalk.green("CreateProject args.data"), args.data);

    let {
      data: {
        url,
        ...data
      },
    } = args;


    if (url) {

      url = url.trim();

      if (!url.match(/^http.*\:\/\//)) {
        url = `http://${url}`;
      }

    }


    Object.assign(data, {
      url,
    });


    args.data = data;

    return super.mutate(method, args);
  }

}



class ModxclubProjectModule extends ProjectModule {

  getProcessorClass() {
    return ModxclubProjectProcessor;
  }

}


export default ModxclubProjectModule;