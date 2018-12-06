

import PrismaModule from "@prisma-cms/prisma-module";

import SocietyModule from "@prisma-cms/society-module";
import EthereumModule from "@prisma-cms/ethereum-module";
import ImportModule from "@modxclub/import-old-site";

import LogModule from "@prisma-cms/log-module";
import MailModule from "@prisma-cms/mail-module";
import UploadModule from "@prisma-cms/upload-module";
import RouterModule from "@prisma-cms/router-module";

import UserModule from "./user";
import ResourceModule from "./resource";
import BlogModule from "./blog";
import CooperationModule from "./cooperation";

import MergeSchema from 'merge-graphql-schemas';

import chalk from 'chalk';

import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;

import { parse, print } from "graphql";

class ModxclubModule extends PrismaModule {


  constructor(options) {

    super(options);

    this.mergeModules([
      LogModule,
      MailModule,
      UploadModule,
      RouterModule,
      SocietyModule,
      EthereumModule,
      UserModule,
      ResourceModule,
      BlogModule,
      ImportModule,
      CooperationModule,
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
      // "Mutation",

      "UserCreateInput",
      "UserUpdateInput",

      "ResourceCreateInput",
      "ResourceUpdateInput",

      "UserCreateOneWithoutResourcesInput",
      "NotificationTypeUpdateManyWithoutUsersInput",

      "UserSubscriptionPayload",
      "ResourceSubscriptionPayload",


      // Cooperation
      "ProjectCreateInput",
      "ProjectUpdateInput",
      "TaskSubscriptionPayload",
      "ProjectMemberCreateManyInput",
      "TaskCreateManyWithoutProjectInput",
      "TaskCreateInput",
      "TaskUpdateInput",
      "ProjectCreateOneWithoutTasksInput",
      "TaskCreateOneWithoutChildsInput",
      "TaskCreateManyWithoutParentInput",
      "TimerCreateInput",
      "TimerUpdateInput",
      "TaskCreateOneWithoutTimersInput",
      "TaskCreateManyWithoutRelatedFromInput",
      "TaskCreateManyWithoutRelatedToInput",
      "TaskCreateOneWithoutMembersInput",
      "UserCreateOneInput",
      "UserCreateOneWithoutTasksInput",
      "TeamCreateOneWithoutChildsInput",
      "TeamCreateManyWithoutParentInput",
      "UserCreateOneWithoutTeamsCreatedInput",
      "TeamMemberCreateManyWithoutTeamInput",
      "ProjectCreateOneInput",
      "UserCreateOneWithoutProjectsInput",
      "ServiceCreateOneInput",
      "TeamCreateOneWithoutMembersInput",
      "UserCreateOneWithoutTeamsInput",
      "ServiceUpdateOneInput",
      "UserUpdateOneInput",
      "ProjectUpdateOneInput",
      "UserUpdateOneWithoutProjectsInput",
      "TaskUpdateManyWithoutProjectInput",
      "UserUpdateOneWithoutProjectsCreatedInput",
      "ProjectMemberUpdateManyInput",
      "TaskUpdateOneWithoutTimersInput",
      "UserUpdateOneWithoutTimersInput",
      "UserUpdateOneWithoutTeamsInput",
      "TeamUpdateOneWithoutMembersInput",
      "TeamMemberUpdateManyWithoutTeamInput",
      "UserUpdateOneWithoutTeamsCreatedInput",
      "TeamUpdateManyWithoutParentInput",
      "TeamUpdateOneWithoutChildsInput",
      "UserUpdateOneWithoutTasksInput",
      "TaskUpdateOneWithoutMembersInput",
      "TaskMemberUpdateManyWithoutTaskInput",
      "ProjectUpdateOneWithoutTasksInput",
      "TaskMemberUpdateManyWithoutTaskInput",
      "TaskUpdateOneWithoutChildsInput",
      "TaskUpdateManyWithoutParentInput",
      "TaskUpdateManyWithoutRelatedToInput",
      "TaskUpdateManyWithoutRelatedFromInput",
      "TimerUpdateManyWithoutTaskInput",
      "ProjectSubscriptionPayload",
      "TimerSubscriptionPayload",


    ]);


    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });

    // console.log(chalk.green("Modxclub apiSchema"), apiSchema);


    /**
     * Фильтруем все резолверы, коих нет в текущем классе
     */
    const resolvers = this.getResolvers();

    const parsed = parse(apiSchema);

    let operations = parsed.definitions.filter(
      n => n.kind === "ObjectTypeDefinition"
        && ["Query", "Mutation", "Subscription"].indexOf(n.name.value) !== -1
      // && !resolvers[n.name.value][]
    );

    operations.map(n => {

      let {
        name: {
          value: operationName,
        },
        fields,
      } = n;

      n.fields = fields.filter(field => {
        // console.log(chalk.green("field"), field);
        return resolvers[operationName][field.name.value] ? true : false;
      });

    });

    apiSchema = print(parsed);


    return apiSchema;

  }



  getResolvers() {


    let resolvers = super.getResolvers();

    // console.log("resolvers", resolvers);

    const {
      Query: {
        letter,
        letters,
        lettersConnection,
        file,
        files,
        filesConnection,
        logedin,
        logedins,
        logedinsConnection,
        log,
        logs,
        logsConnection,

        ...Query
      },
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
      updateTopicProcessor,
      createCommentProcessor,
      updateCommentProcessor,
      singleUpload,
      multipleUpload,
      startImportProcessor,
      resetPassword,
      createProjectProcessor,
      updateProjectProcessor,
      createTaskProcessor,
      updateTaskProcessor,
      createTimerProcessor,
      updateTimerProcessor,

      // ethUnlockPersonalAccount,
    } = Mutation;


    let AllowedMutations = {
      signin,
      signup,
      // createResourceProcessor,
      updateUserProcessor,
      createBlogProcessor,
      createTopicProcessor,
      updateTopicProcessor,
      createCommentProcessor,
      updateCommentProcessor,
      singleUpload,
      multipleUpload,
      startImportProcessor,
      resetPassword,
      createProjectProcessor,
      updateProjectProcessor,
      createTaskProcessor,
      updateTaskProcessor,
      createTimerProcessor,
      updateTimerProcessor,

      // ethUnlockPersonalAccount,
    };

    // for(var i in AllowedMutations){
    //   AllowedMutations[i] = () => {
    //     throw new Error ("Ведутся технические работы. Ориентировочно закончатся в 10 утра по Москве.");
    //   }
    // }

    // Dev
    // for (var i in AllowedMutations) {

    //   const action = AllowedMutations[i];

    //   AllowedMutations[i] = (a, b, c, d) => {
    //     return new Promise((resolve, reject) => {

    //       setTimeout(async () => {
    //         await action(a,b,c,d)
    //           .then(resolve)
    //           .catch(reject);
    //       }, 2000);

    //     });
    //   }
    // }

    // console.log("resolvers other", other);


    // const {
    //   resource,
    // } = Query

    return {
      ...other,
      Query,
      // Query: {
      //   ...Query,
      //   resource: async (source, args, ctx, info) => {

      //     const result = await resource(source, args, ctx, info);

      //     console.log("args where", args.where);
      //     console.log("result", result);

      //     return result;
      //   },
      // },
      Mutation: AllowedMutations,
      Log: {
        stack: () => null,
      },
      Letter: {
        id: () => null,
        email: () => null,
        subject: () => null,
        message: () => null,
      },
    };

  }


}


export default ModxclubModule;