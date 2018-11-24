
import CooperationModule from "@prisma-cms/cooperation-module";

import ProjectModule from "./project";


export default class CooperationModuleCustom extends CooperationModule{

  constructor(props = {}) {

    super(props);

    this.mergeModules([
      ProjectModule,
    ]);
 
  }

}