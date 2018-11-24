

import PrismaModule from "@prisma-cms/prisma-module";

import SocietyModule from "@prisma-cms/society-module";
import ImportModule from "@modxclub/import-old-site";

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
      SocietyModule,
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
      "Mutation",

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
      "TaskSubscriptionPayload",
      "ProjectMemberCreateManyInput",
      "TaskCreateManyWithoutProjectInput",
      "TaskCreateInput",
      "ProjectCreateOneWithoutTasksInput",
      "TaskCreateOneWithoutChildsInput",
      "TaskCreateManyWithoutParentInput",
      "TimerCreateInput",
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

    // console.log("apiSchema", apiSchema);


    /**
     * Фильтруем все резолверы, коих нет в текущем классе
     */
    const resolvers = this.getResolvers();

    // console.log(chalk.green("resolvers"), resolvers);


    const parsed = parse(apiSchema);

    // parsed.definitions = parsed.definitions.filter(
    //   n => n.kind !== "SchemaDefinition" && !(
    //     n.kind === "ObjectTypeDefinition" && ["Query", "Mutation", "Subscription"].indexOf(n.name.value) !== -1)
    // );

    let operations = parsed.definitions.filter(
      n => n.kind === "ObjectTypeDefinition"
        && ["Query", "Mutation", "Subscription"].indexOf(n.name.value) !== -1
      // && !resolvers[n.name.value][]
    );

    // console.log(chalk.green("parsed.definitions"), parsed.definitions);
    // console.log(chalk.green("operations"), operations);

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

    // console.log(chalk.green("operations 2"), operations);

    apiSchema = print(parsed);


    return apiSchema;

  }



  getResolvers() {


    let resolvers = super.getResolvers();

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

    return {
      ...other,
      Query: {
        ...Query,
      },
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