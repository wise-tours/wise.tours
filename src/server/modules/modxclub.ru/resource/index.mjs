

// import PrismaModule from "@prisma-cms/prisma-module";

import ResourceModule, {
  ResourceProcessor,
} from "@prisma-cms/resource-module";

import MergeSchema from 'merge-graphql-schemas';

import path from 'path';
import chalk from "chalk";

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { fileLoader, mergeTypes } = MergeSchema;


export class ModxclubResourceProcessor extends ResourceProcessor {


  async create(method, args, info) {


    const {
      currentUser,
      db,
    } = this.ctx;

    const {
      id: currentUserId,
    } = currentUser || {};

    if (!currentUserId) {
      throw new Error("Необходимо авторизоваться");
    }


    let {
      data: {
        // blogID,
        topicID,
        parent,
        topic_tags,

        // Временно, так как у кого-нибудь могут закешироваться данные в браузере
        text: fake,
        ...data
      },
    } = args;


    let {
      type,
      name,
    } = data;


    switch (type) {

      case "Topic":

        {

          const {
            contentText,
          } = this.prepareContent(args, data, method) || {};

          if (!contentText) {
            // this.addFieldError("content", "Не заполнен текст");
            this.addError("Не заполнен текст");
            return;
          }

          const uri = `/topics/${name}`;

          Object.assign(data, {
            uri,
            isfolder: false,
            Blog: {
              connect: {
                // id: blogID,
                oldID: 637,
              },
            },
          });


          Object.assign(args, {
            data,
          });


          const result = await super.create(method, args, info);


          const {
            id: topicID,
            name: topicName,
            uri: topicUri,
          } = result || {};


          /**
           * Если был создан топик, отправляем уведомления
           */
          if (topicID) {

            const siteUrl = "https://modxclub.ru";

            let subject = `Новый топик ${topicName}`;
            let message = `<p>
              <a href="${siteUrl}${topicUri}">${topicName}</a>.
            </p>
              <div>
                ${contentText.substr(0, 3000)}
              </div>
            `;

            const usersWhere = {
              id_not: currentUserId,
              NotificationTypes_some: {
                name: "new_topic",
              },
            }

            this.sendNotifications(message, subject, usersWhere);
            
          }
        }

        break;


      case "Comment":

        /**
         * Пока что комментарии есть к топикам.
         * И топик и комментарий - это тип Resource.
         * Связь проходит через тип Thread.
         * Если для указанного топика нет еще Thread, значит создаем его.
         */


        const {
          contentText,
        } = this.prepareContent(args, data, method) || {};

        if (!contentText) {
          // this.addFieldError("content", "Не заполнен текст");
          this.addError("Не заполнен текст");
          return;
        }
        else {

          let name = contentText.substr(0, 50) || "";


          if (!topicID) {
            return this.addError("Не был указан ID топика");
          }
          else {

            // Проверяем есть ли такой топик
            // const exists = await db.exists.Resource({
            //   id: topicID,
            //   type: "Topic",
            // });

            // Получаем топик
            const Topic = await db.query.resource({
              where: {
                id: topicID,
              },
            });

            if (!Topic) {
              return this.addError("Не был получен топик");
            }
            else {

              const {
                uri: TopicUri,
                name: topicName,
              } = Topic;

              Object.assign(data, {

                name,
                // uri: `${TopicUri}/comments/${name}`,
                uri: `/comments/${TopicUri}/${name}`,
                isfolder: false,

                CommentTarget: {
                  connect: {
                    id: topicID,
                  },
                },
              });


              Object.assign(args, {
                data,
              });

              const result = await super.create(method, args, info);

              const {
                id: commentId,
              } = result || {};

              // console.log(chalk.green("result"), result, commentId);

              /**
               * Если был создан комментарий, отправляем уведомления
               */
              if (commentId) {

                const siteUrl = "https://modxclub.ru";

                let subject = `Новый комментарий в топике ${topicName}`;
                let message = `<p>
                  В топике <a href="${siteUrl}${TopicUri}">${topicName}</a> создан новый комментарий.
                </p>
                  <div>
                    ${contentText.substr(0, 1000)}
                  </div>
                `;

                const usersWhere = {
                  id_not: currentUserId,
                  Resources_some: {
                    OR: [
                      {
                        id: topicID,
                      },
                      {
                        CommentTarget: {
                          id: topicID,
                        },
                      },
                    ],
                  },
                  NotificationTypes_some: {
                    name_in: ["new_comment", "new_reply"],
                  },
                }

                this.sendNotifications(message, subject, usersWhere);

              }

              return result;
            }

          }

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



  async update(method, args, info) {

    let {
      where,
      ...other
    } = args;

    const {
      currentUser,
      db,
    } = this.ctx;

    const {
      id: currentUserId,
    } = currentUser || {};

    if (!currentUserId) {
      throw new Error("Необходимо авторизоваться");
    }

    const resource = await db.query.resource({
      where,
    }, `{
      id
      CreatedBy{
        id
      }
    }`);

    if (!resource) {
      throw new Error("Не был получен ресурс");
    }

    const {
      id: createdby,
    } = resource.CreatedBy || {};

    if (createdby !== currentUserId) {
      throw new Error("Нельзя редактировать чужой документ");
    }


    return super.update(method, args, info);
  }


  async sendNotifications(message, subject, where) {

    const {
      ctx,
    } = this;

    const {
      db,
    } = ctx;

    const users = await db.query.users({
      where: {
        email_gt: "",
        ...where,
      }
    })
      .catch(error => {
        console.error(chalk.red("Error"), error);
      })
      ;


    const processor = this.getProcessor(message, subject, users, this.writeEmail.bind(this));

    for await (const result of processor) {


    }

  }


  async * getProcessor(message, subject, users, processor) {

    while (users && users.length) {

      const user = users.splice(0, 1)[0];


      const result = await processor(message, subject, user)
        .catch(error => {

          console.log(chalk.red("getProcessor error"), error);

          this.error(error);
          return error;
        });


      yield result;
    }

    // await this.log(`Записано: ${writed}, пропущено: ${skiped}, ошибок: ${errors}`, "Info");

    // if (errors) {
    //   throw new Error("Есть ошибки при импорте");
    // }

  }

  async writeEmail(message, subject, user) {

    // console.log(chalk.green("writeEmail"), message, subject, user);

    const {
      db,
    } = this.ctx;

    const {
      email,
    } = user;

    const result = await db.mutation.createLetter({
      data: {
        message,
        subject,
        email,
      },
    })
      .catch(error => {

        console.log(chalk.red("writeEmail error"), error);

        this.error(error);
      });

    return result;
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
      ...other,
      Mutation: {
        ...Mutation,
        createBlogProcessor: (source, args, ctx, info) => {

          Object.assign(args.data, {
            type: "Blog",
          });

          return this.getProcessor(ctx).createWithResponse("Resource", args, info);
        },
        createTopicProcessor: (source, args, ctx, info) => {

          Object.assign(args.data, {
            type: "Topic",
          });

          return this.getProcessor(ctx).createWithResponse("Resource", args, info);
        },
        createCommentProcessor: (source, args, ctx, info) => {

          Object.assign(args.data, {
            type: "Comment",
          });

          return this.getProcessor(ctx).createWithResponse("Resource", args, info);
        },
        updateCommentProcessor: (source, args, ctx, info) => {

          return this.getProcessor(ctx).updateWithResponse("Resource", args, info);
        },
        updateTopicProcessor: (source, args, ctx, info) => {

          return this.getProcessor(ctx).updateWithResponse("Resource", args, info);
        },
      },
      Subscription: {
        resource: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.resource({}, info);
          },
        },
      },
    };

  }


  getProcessorClass() {
    return ModxclubResourceProcessor;
  }

}


export default ModxclubTopicModule;