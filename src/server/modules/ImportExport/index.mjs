
import PrismaModule from "@prisma-cms/prisma-module";

import TemplateModule from './Template';

export default class ImportExportModule extends PrismaModule {

  constructor(props) {

    super(props);

    this.mergeModules([
      TemplateModule,
    ]);

  }

}