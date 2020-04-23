/* eslint-disable no-unreachable */


// import PrismaModule from "@prisma-cms/prisma-module";

import PrismaCmsResourceModule, {
  ResourceProcessor,
} from "@prisma-cms/resource-module";

import chalk from "chalk";
import jwt from "jsonwebtoken";

export class PrismaCmsResourceProcessor extends ResourceProcessor {

  constructor(props) {

    super(props);

    this.private = true;
    this.ownable = true;

  }

  async create(method, args, info) {


    const {
      currentUser,
      // db,
      siteUrl,
    } = this.ctx;

    const {
      id: currentUserId,
    } = currentUser || {};

    // if (!currentUserId) {
    //   throw new Error("Необходимо авторизоваться");
    // }


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

      case "Blog":

        {

          this.prepareContent(args, data, method);

          // if (!contentText) {
          //   // this.addFieldError("content", "Не заполнен текст");
          //   this.addError("Не заполнен текст");
          //   return;
          // }

          const uri = `/blogs/${name}`;


          Object.assign(data, {
            uri,
            isfolder: true,
          });


          Object.assign(args, {
            data,
          });

          const result = await super.create(method, args, info);

          return result;
        }

        break;

      case "Topic":

        {

          const {
            contentText,
          } = this.prepareContent(args, data, method) || {};

          // console.log('contentText', contentText);

          if (!contentText) {
            this.addFieldError("content", "Не заполнен текст");
            this.addError("Не заполнен текст");
            return;
          }

          const uri = `/topics/${name}`;

          // let connect;

          // let Blog;

          // if (blogID) {
          //   Blog = {
          //     connect: {
          //       id: blogID,
          //     },
          //   }
          // }
          // else {
          //   connect = {
          //     oldID: 637,
          //   };
          // }

          Object.assign(data, {
            uri,
            isfolder: false,
            // Blog,
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

            let content;

            if (contentText) {

              content = `
              <div>
                ${contentText.substr(0, 3000)}
              </div>
              `;
            }

            let subject = `Новый топик ${topicName}`;
            let message = `<p>
              <a href="${siteUrl}${topicUri}">${topicName}</a>.
            </p>
              ${content}
            `;

            const usersWhere = {
              // id_not: currentUserId,
              NotificationTypes_some: {
                name: "new_topic",
              },
            }

            if (currentUserId) {
              Object.assign(usersWhere, {
                id_not: currentUserId,
              });
            }

            this.sendNotifications({ message, subject }, usersWhere);

          }

          return result;
        }

        break;


      // case "Comment":



      //   break;

      default: ;
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
      // ...other
    } = args;

    const {
      currentUser,
      db,
    } = this.ctx;

    const {
      id: currentUserId,
      sudo,
    } = currentUser || {};

    if (!currentUserId) {
      throw new Error("Необходимо авторизоваться");
    }

    if (!sudo) {

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

    }


    return super.update(method, args, info);
  }


  async mutate(method, args, info) {

    // console.log('Resource mutate args', JSON.stringify(args, true, 2));

    // if (!this.hasErrors()) {
    //   return false;
    // }

    return super.mutate(method, args, info);
  }


  async sendNotifications(data, where) {

    // console.log('sendNotifications data', JSON.stringify(data, true, 2));
    // console.log('sendNotifications where', JSON.stringify(where, true, 2));

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

    // console.log('sendNotifications users', JSON.stringify(users, true, 2));

    const processor = this.getProcessor(data, users, this.writeEmail.bind(this));

    // eslint-disable-next-line no-unused-vars
    for await (const result of processor) {


    }

  }


  async * getProcessor(data, users, processor) {

    while (users && users.length) {

      const user = users.splice(0, 1)[0];


      const result = await processor(data, user)
        .catch(error => {



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

  async writeEmail(data, user) {

    const {
      db,
      siteUrl,
    } = this.ctx;

    const {
      id: userId,
      email,
    } = user;

    let {
      message,
    } = data;

    if (!message) {
      return false;
    }

    const key = jwt.sign({
      userId,
    }, process.env.APP_SECRET);

    const unsubscribeLink = `${siteUrl}/system/unsubscribe/${userId}/${key}`;

    message = `${message}
    <hr /><br />
    <div style="color:grey">
    Если хотите отписаться, это можно сделать в личном кабинете или просто перейти по <a href="${unsubscribeLink}">ссылке</a>
    </div>
    `;

    const result = await db.mutation.createLetter({
      data: {
        ...data,
        message,
        // subject,
        email,
      },
    })
      .catch(error => {

        console.error(chalk.red("writeEmail error"), error);

        this.error(error);
      });

    return result;
  }



  prepareContent(args, data, method) {

    let {
      data: {
        // content,
        components,
      },
    } = args;


    if (components !== undefined) {

      let resourceBlocks = [];
      let entityMap = {};



      // if (components && components.length) {

      //   components.map(n => {

      //     const {
      //       content,
      //     } = n.props || {};

      //     const {
      //       blocks,
      //     } = content || {};

      //     if (blocks && blocks.length) {

      //       resourceBlocks = resourceBlocks.concat(blocks);

      //     }

      //   });

      // }

      this.reduceBlocks(components, resourceBlocks, entityMap);


      let newContent = null;


      if (resourceBlocks.length) {

        newContent = {
          blocks: resourceBlocks,
          entityMap,
        }

      }


      Object.assign(data, {
        content: newContent,
        // contentText,
      });

      Object.assign(args.data, {
        ...data,
      });

    }


    data = super.prepareContent(args, data, method);


    return data;
  }



  reduceBlocks(components, resourceBlocks, entityMap, textLength = 0) {

    if (components && components.length) {

      // console.log(chalk.green("components"), JSON.stringify(components, true, 2));


      components.map(n => {

        const {
          components: itemComponents,
          props,
        } = n || {};

        const {
          content,
          text: contentText,
        } = props || {};

        if (contentText !== undefined) {

          textLength += contentText ? contentText.length : 0;

          resourceBlocks.push({
            text: contentText || "",
          });

        }
        else {
          const {
            blocks,
            // entityMap: contentEntityMap,
          } = content || {};

          if (blocks && blocks.length) {

            // resourceBlocks = resourceBlocks.concat(blocks);

            blocks.map(block => {

              const {
                text,
              } = block;

              textLength += text ? text.length : 0;

              resourceBlocks.push(block);

              return null;
            });

          }
        }


        // console.log(chalk.green("textLength"), textLength);

        this.reduceBlocks(itemComponents, resourceBlocks, entityMap, textLength);

        return null;
      });

    }

  }

}


export class TopicProcessor extends PrismaCmsResourceProcessor {


  async mutate(method, args, info) {

    let {
      blogID,
      ...data
    } = args.data || {};

    let Blog;

    if (blogID) {
      Blog = {
        connect: {
          id: blogID,
        },
      }
    }


    Object.assign(data, {
      Blog,
    });


    Object.assign(args, {
      data,
    });

    // console.log('Topic mutate data', JSON.stringify(data, true, 2));

    return super.mutate(method, args, info);
  }

}

export class CommentProcessor extends PrismaCmsResourceProcessor {


  async create(method, args, info) {

    // console.log('CommentProcessor create args.data', JSON.stringify(args.data, true, 2));

    let {
      topicID,
      Topic,
      ...data
    } = args.data || {};

    const {
      ctx: {
        db,
        siteUrl,
        currentUser,
      },
    } = this;

    const {
      id: currentUserId,
    } = currentUser || {};

    /**
     * Пока что комментарии есть к топикам.
     * И топик и комментарий - это тип Resource.
     * Связь проходит через тип Thread.
     * Если для указанного топика нет еще Thread, значит создаем его.
     */


    const {
      contentText,
    } = this.prepareContent(args, data, method) || {};


    let topicName;
    let TopicUri;

    if (!contentText) {
      // this.addFieldError("content", "Не заполнен текст");
      this.addError("Не заполнен текст");
      return;
    }
    else {

      let name = contentText.substr(0, 50) || "";

      if (Topic) {

        const {
          connect,
          create,
        } = Topic;

        if (connect) {

          topicID = connect.id;
        }
        else if (create) {

          topicName = create.name;
          TopicUri = create.uri;

        }
      } else {

      }

      if (topicID !== undefined) {

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
          const topic = await db.query.resource({
            where: {
              id: topicID,
            },
          });

          if (!topic) {
            return this.addError("Не был получен топик");
          }
          // else {

          // }


          Topic = {
            connect: {
              id: topicID,
            },
          };



          // const {
          //   uri: TopicUri,
          //   name: topicName,
          // } = topic;

          topicName = topic.name;
          TopicUri = topic.uri;

        }

      }


      if (!TopicUri) {
        throw new Error("TopicUri is empty");
      }

      if (!topicName) {
        throw new Error("topicName is empty");
      }

      Object.assign(data, {

        name,
        // uri: `${TopicUri}/comments/${name}`,
        uri: `/comments/${TopicUri}/${name}`,
        isfolder: false,

        Topic,
      });


      Object.assign(args, {
        data,
      });

      const result = await super.create(method, args, info);

      const {
        id: commentId,
      } = result || {};

      // console.log('result', JSON.stringify(result, true, 2));


      /**
       * Если был создан комментарий, 
       */
      if (commentId) {

        const comment = await db.query.resource({
          where: {
            id: commentId,
          },
        }, `
          {
            id
            Topic {
              id
              name
            }
          }
        `);


        // console.log('result comment', JSON.stringify(comment, true, 2));

        if (comment) {

          const {
            Topic,
          } = comment;

          const {
            id: topicID,
            name: topicName,
          } = Topic || {};

          // console.log('result topicID', topicID);

          if (topicID) {

            /**
             * Обновляем дату топика, чтобы сортировку актуализировать
             */
            await db.mutation.updateResource({
              data: {
                mockUpdate: new Date(),
              },
              where: {
                id: topicID,
              },
            })
              .catch(error => {
                /**
                 * Не обламываем процесс, если не получилось обновить дату топика
                 */
                this.error(error);
                console.error(chalk.red("Update Topic error"), error);
              });


            /**
             * отправляем уведомления
             */
            let subject = `Новый комментарий в топике ${topicName}`;
            let message = `<p>
                    В топике <a href="${siteUrl}${TopicUri}">${topicName}</a> создан новый комментарий.
                  </p>
                    <div>
                      ${contentText.substr(0, 1000)}
                    </div>
                  `;

            const usersWhere = {
              // id_not: currentUserId,
              Resources_some: {
                OR: [
                  {
                    id: topicID,
                  },
                  {
                    Topic: {
                      id: topicID,
                    },
                  },
                ],
              },
              NotificationTypes_some: {
                name_in: ["new_comment", "new_reply", "new_comments_in_my_topics"],
              },
            }

            if (currentUserId) {
              Object.assign(usersWhere, {
                id_not: currentUserId,
              });
            }

            this.sendNotifications({
              message,
              subject,
              rank: 100,
            }, usersWhere);
          }

        }



      }

      return result;

    }


    // Object.assign(data, {
    // });


    // Object.assign(args, {
    //   data,
    // });

    // console.log('CommentProcessor create data', JSON.stringify(data, true, 2));

    // return super.create(method, args, info);
  }


  async mutate(method, args, info) {

    let {
      ...data
    } = args.data || {};



    Object.assign(data, {
    });


    Object.assign(args, {
      data,
    });

    // console.log('CommentProcessor mutate data', JSON.stringify(data, true, 2));

    return super.mutate(method, args, info);
  }

}


export class UserReviewProcessor extends CommentProcessor {

  constructor(props) {

    super(props);

    /**
     * Отзывы к пользователям могут оставлять и неавторизованные пользователи
     */
    this.private = false;

  }


  async create(method, args, info) {

    const {
      currentUser,
      db,
    } = this.ctx;

    const {
      id: currentUserId,
    } = currentUser || {};

    const {
      data: {
        Reviewed,
        ...data
      },
    } = args;


    const {
      connect,
    } = Reviewed || {};

    if (!connect) {
      throw new Error("Не указан пользователь");
    }

    const reviewedUser = await db.query.user({
      where: connect,
    }, `
      {
        id
        username
        fullname
        ReviewThread{
          id
        }
      }
    `);

    // console.log('reviewedUser', JSON.stringify(reviewedUser, true, 2));

    if (!reviewedUser) {
      throw new Error("Не был получен пользователь");
    }

    const {
      id: reviewedUserId,
      username,
      fullname,
      ReviewThread,
    } = reviewedUser;

    if (reviewedUserId === currentUserId) {
      throw new Error("Нельзя писать отзыв самому себе");
    }


    let Topic;

    if (ReviewThread) {
      Topic = {
        connect: {
          id: ReviewThread.id,
        },
      }
    }
    else {

      const displayName = fullname || username || reviewedUserId;

      const topicData = {

        name: `Отзывы о пользователе ${displayName}`,
        uri: `/topics/users-review/Отзывы о пользователе ${displayName}`,
        type: "Topic",

        /**
         * Публикуем в специальный блог
         */
        Blog: {
          connect: {
            code: "users-review",
          },
        },
        Reviewed,

      }

      Object.assign(topicData, {
        ...await this.prepareUri({
          data: topicData,
        }),
      });

      Topic = {
        create: topicData,
      }
    }


    // console.log('args', JSON.stringify(args, true, 2));

    // const uri2 = await this.prepareUri({
    //   data: {
    //     ...data,
    //     name: "wefwefwefwef",
    //     uri: "/wefwefwefewf/новый вредитель.html",
    //     isfolder: false,
    //   },
    // });

    // console.log('uri2', uri2);

    // // return;

    // // throw new Error("sdfsdf");

    // return;

    /**
     * Формируем УРЛ
     */

    /**
     * Отзыв создается в специальный топик пользователя.
     * У пользователя может быть только один топик под такие отзывы.
     * Если топика нет, создаем его.
     * Если есть, то сразу в него коннектим.
     */

    // const {
    //   uri,
    // } = await this.prepareUri({
    //   data,
    //   uri: "/DSfsdfsdf",
    // });

    Object.assign(data, {
      // type: "UserReview",
      Topic,
    });


    Object.assign(args, {
      data,
    });


    return super.create(method, args, info);
  }


  // async mutate(method, args, info) {

  //   console.log('UserReviewProcessor mutate args', JSON.stringify(args, true, 2));

  //   if (!this.hasErrors()) {
  //     return false;
  //   }

  //   return super.mutate(method, args, info);
  // }

}


class ResourceModule extends PrismaCmsResourceModule {


  // constructor() {

  //   super();

  //   this.mergeModules([
  //     SocialModule,
  //   ]);

  // }


  getSchema() {

    return;
  }


  getApiSchema(types = []) {


    return;

  }



  injectWhereUnique(source, args, ctx, info, where) {

    let {
      uri,
    } = where || {};

    /**
     * Если указан ури, но не начинается со слеша, то добавляем слеш
     */
    if (uri && !uri.startsWith("/")) {
      where.uri = `/${uri}`;
    }

    return where;

  }


  getResolvers() {


    let resolvers = super.getResolvers();

    const {
      Mutation: {
        ...Mutation
      },
      Query: {
        resource,
        ...Query
      },
      Resource,
      ...other
    } = resolvers;



    return {
      ...other,
      Query: {
        ...Query,
        resource: async (source, args, ctx, info) => {

          const {
            db,
          } = ctx;

          const {
            where,
          } = args;

          /**
           * Во фронт-редакторе пока что недоработка с обработкой УРЛов (точнее запросов от роутера,
           * нельзя задать path: ":uri", можно только path: "/:uri*"),
           * поэтому приходится добавлять в начало слеш, если не указан.
           */
          // modifyArgs(source, args, ctx, info, this.injectWhereUnique);

          let result;

          let {
            uri,
          } = where || {};

          const OR = [];

          /**
           * Если указан ури, но не начинается со слеша, то добавляем слеш
           */
          if (uri) {

            OR.push(
              {
                uri,
              },
            );

            if (!uri.startsWith("/")) {
              uri = `/${uri}`;

              OR.push({
                uri,
              });
            }

            if (!uri.endsWith("/")) {
              uri = `${uri}/`;

              OR.push({
                uri,
              });
            }



          }

          if (OR.length > 1) {

            args.where = {
              OR,
            };

            // console.log('args.where', args.where);
            // console.log('resource 1');

            // return where;
            [result] = await db.query.resources({
              ...args,
              first: 1,
            }, info);

            return result;
          }

          else if (OR.length === 1) {
            args.where = OR[0];
          }


          // console.log('args.where', args.where);

          // console.log('resource 2');
          result = await resource(source, args, ctx, info);


          // console.log('resource', result);

          return result;
        },
      },
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

          // return this.getProcessor(ctx).createWithResponse("Resource", args, info);
          return new TopicProcessor(ctx).createWithResponse("Resource", args, info);
        },
        updateTopicProcessor: (source, args, ctx, info) => {

          // return this.getProcessor(ctx).updateWithResponse("Resource", args, info);
          return new TopicProcessor(ctx).updateWithResponse("Resource", args, info);
        },
        createCommentProcessor: (source, args, ctx, info) => {

          Object.assign(args.data, {
            type: "Comment",
          });

          return new CommentProcessor(ctx).createWithResponse("Resource", args, info);
        },
        updateCommentProcessor: (source, args, ctx, info) => {

          return new CommentProcessor(ctx).updateWithResponse("Resource", args, info);
        },
        updateBlogProcessor: (source, args, ctx, info) => {

          return this.getProcessor(ctx).updateWithResponse("Resource", args, info);
        },
        // deleteBlog: (source, args, ctx, info) => {

        //   return ctx.db.mutation.deleteBlog(args);
        // },
        // createUserReviewProcessor: (source, args, ctx, info) => {

        //   return new UserReviewProcessor(ctx).createWithResponse("Resource", args, info);
        // },
      },
      Subscription: {
        resource: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.resource({}, info);
          },
        },
      },
      Resource: {
        ...Resource,

        /**
         * Так как ввели новое поле components, если оно заполнено, 
         * то поле content не выводим в целях экономии ресурсов
         */
        content: (source, args, ctx, info) => {

          const {
            content,
            components,
          } = source || {};

          return components ? null : Resource && Resource.content ? Resource.content(source, args, ctx, info) : content;
        },
        // Comments: (source, args, ctx, info) => {

        //   const {
        //     id,
        //     Comments,
        //   } = source;

        //   return id ? ctx.db.query.resources({
        //     where: {
        //       Topic: {
        //         id,
        //       },
        //     },
        //   }, info)
        //     : Comments;
        // },

        /**
         * Для обратной совместимости, потому что CommentTarget переименовалось в Topic
         */
        CommentTarget: async (source, args, ctx, info) => {

          const {
            id: commentId,
            CommentTarget,
            // Topic,
          } = source;

          let result = null;

          if (CommentTarget !== undefined) {
            result = CommentTarget;
          }

          else if (commentId) {

            const [topic] = await ctx.db.query.resources({
              first: 1,
              where: {
                Comments_some: {
                  id: commentId,
                },
              },
            }, info);

            result = topic;

          }

          return result;

        },
      },
    };

  }


  getProcessorClass() {
    return PrismaCmsResourceProcessor;
  }

}


export default ResourceModule;