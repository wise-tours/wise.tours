
import React from "react";

import PropTypes from "prop-types";


import { Renderer as PrismaCmsRenderer } from "@prisma-cms/front";

import withStyles from "material-ui/styles/withStyles";

import MainMenu from "../menu/mainMenu";



import MainPage from "../pages/MainPage";
// import UsersPage from "@prisma-cms/front/lib/modules/pages/UsersPage";
import UsersPage from "../pages/UsersPage/";
import UserPage from "./pages/UsersPage/UserPage";
import TopicsPage from "../pages/Topics";
import TopicPage from "../pages/Topics/Topic";
import TopicCreatePage from "../pages/Topics/Topic/Create";
import TagPage from "../pages/Tags/Tag";
import BlogsPage from "../pages/Blogs";
import BlogPage from "../pages/Blogs/Blog";
import BlogCreatePage from "../pages/Blogs/Blog/Create";
import CommentsPage from "../pages/Comments";
import CommentPage from "../pages/Comments/Comment";
import ProjectsPage from "../pages/cooperation/Projects";
import ProjectPage from "../pages/cooperation/Projects/Project";
import ProjectCreatePage from "../pages/cooperation/Projects/Project/Create";
import TasksPage from "../pages/cooperation/Tasks";
import TaskPage from "../pages/cooperation/Tasks/Task";
import TaskCreatePage from "../pages/cooperation/Tasks/Task/Create";
import TimersPage from "../pages/cooperation/Timers";
import TimerPage from "../pages/cooperation/Timers/Timer";

import TransactionsPage from "../pages/ethereum/Transactions";
import TransactionPage from "../pages/ethereum/Transactions/Transaction";

import ChatRoomsPage from "../pages/society/ChatRooms";
import ChatRoomPage from "../pages/society/ChatRooms/ChatRoom";
import CreateChatRoomPage from "../pages/society/ChatRooms/ChatRoom/Create";

import ChatMessagesPage from "../pages/society/ChatMessages";
import ChatMessagePage from "../pages/society/ChatMessages/ChatMessage";

import SubscriptionProvider from "./SubscriptionProvider";

import ReactLesson1 from "../pages/lessons/react/lesson1";

import Context from "@prisma-cms/context";


import {
  ContextProvider as ResourceContextProvider,
  SubscriptionProvider as ResourceSubscriptionProvider,
} from "@prisma-cms/resource";

import {
  ContextProvider as SocietyContextProvider,
  SubscriptionProvider as SocietySubscriptionProvider,
} from "@prisma-cms/society";

import {
  ContextProvider as EthereumContextProvider,
  SubscriptionProvider as EthereumSubscriptionProvider,
} from "@prisma-cms/ethereum";

import {
  ContextProvider as WebrtcContextProvider,
  SubscriptionProvider as WebrtcSubscriptionProvider,
  WebRtcChatProvider,
} from "@prisma-cms/webrtc";

import ContextProvider from "./ContextProvider";


export const styles = theme => {

  // console.log("theme", theme);

  const {
    typography: {
      fontFamily,
      fontSize,
    },
    palette: {
      text: {
        primary,
      },
    },
  } = theme;

  return {
    root: {
      fontFamily,
      fontSize,
      color: primary,

      height: "100%",
      display: "flex",
      flexDirection: "column",

      "& #Renderer--body": {
        flex: 1,
        overflow: "auto",
        width: "100%",
      },
    },

    header: {
      marginBottom: 6,
      position: "relative",
      zIndex: 1,
    },

    body: {
      flex: 1,
      overflow: "auto",
    },
  }

}


export class Renderer extends PrismaCmsRenderer {

  // static contextTypes = {
  //   ...PrismaCmsRenderer.contextTypes,
  //   getQueryFragment: PropTypes.func.isRequired,
  //   client: PropTypes.object.isRequired,
  //   loadApiData: PropTypes.func.isRequired,
  // }


  // static childContextTypes = {
  //   ...PrismaCmsRenderer.childContextTypes,
  //   UserLink: PropTypes.func,
  //   ProjectLink: PropTypes.func,
  //   TaskLink: PropTypes.func,
  //   TransactionLink: PropTypes.func,
  // }


  // getChildContext() {

  //   const {
  //     UserLink,
  //     ProjectLink,
  //     TaskLink,
  //     TransactionLink,
  //   } = UI;

  //   return {
  //     ...super.getChildContext(),
  //     UserLink,
  //     ProjectLink,
  //     TaskLink,
  //     TransactionLink,
  //   }
  // }


  getRoutes() {


    const {
      getQueryFragment,
    } = this.context;


    let baseRoutes = super.getRoutes();

    let mainPageIndex = baseRoutes.findIndex(n => n.path === "/");
    if (mainPageIndex) {
      baseRoutes.splice(mainPageIndex, 1);
    }



    var routeIndex;

    while ((routeIndex = baseRoutes.findIndex(n => n.path.startsWith("/user"))) !== -1) {

      baseRoutes.splice(routeIndex, 1);

    };


    let routes = [
      {
        exact: true,
        path: "/",
        component: MainPage,
      },
      {
        exact: true,
        path: "/people",
        component: UsersPage,
      },
      {
        exact: true,
        path: "/profile/:username",
        render: (props) => {
          const {
            params,
          } = props.match;

          const {
            username,
          } = params || {};

          return <UserPage
            getQueryFragment={getQueryFragment}
            key={username}
            where={{
              username,
            }}
            {...props}
          />
        }
      },
      {
        exact: true,
        path: "/comments",
        component: CommentsPage,
      },
      {
        exact: true,
        path: "/comments/comment-:commentOldID(\\d+).html",
        render: (props) => {

          // console.log("props", props);

          const {
            match: {
              params: {
                commentOldID,
              },
            },
          } = props;

          return <CommentPage
            key={commentOldID}
            where={{
              commentOldID: parseInt(commentOldID),
            }}
            {...props}
          />
        }
      },
      {
        exact: false,
        path: "/comments/(.+)",
        render: (props) => {

          const {
            match: {
              url,
              // params: {
              //   0: commentId,
              // },
            },
          } = props;

          return <CommentPage
            key={url}
            where={{
              uri: url,
            }}
            {...props}
          />
        }
      },
      {
        exact: true,
        path: "/add-topic.html",
        component: TopicCreatePage,
      },
      {
        exact: true,
        path: "/topics",
        component: TopicsPage,
      },
      {
        exact: false,
        // path: "(/topics/.+|blog/.+[0-9].html)",
        path: /^(\/topics\/.+|\/blog\/.+[0-9].html)/,
        render: (props) => {

          const {
            match: {
              params: {
                0: uri,
              },
              // url: uri,
            },
          } = props;

          return <TopicPage
            key={uri}
            where={{
              uri: uri,
            }}
            {...props}
          />
        }
      },
      {
        exact: true,
        path: "/blogs",
        component: BlogsPage,
      },
      {
        exact: true,
        path: "/blogs/create",
        component: BlogCreatePage,
      },
      {
        exact: false,
        path: "(/blogs?/.+)",
        render: (props) => {

          const {
            match: {
              params: {
                0: uri,
              },
            },
          } = props;

          return <BlogPage
            where={{
              uri,
            }}
            {...props}
          />
        }
      },
      {
        exact: false,
        path: /^\/tag\/(.+?)\/?$/,
        render: (props) => {
          const {
            match: {
              params: {
                0: tagName,
              },
            },
          } = props;

          return <TagPage
            tagName={tagName}
            {...props}
          />
        }
      },
      {
        exact: true,
        path: [
          "/projects",
          "/katalog-sajtov",
        ],
        component: ProjectsPage,
      },
      {
        exact: true,
        path: "/projects/create",
        component: ProjectCreatePage,
      },
      {
        exact: false,
        path: [
          "/projects",
          "/katalog-sajtov",
        ],
        // component: ProjectPage,
        // path: "/projects/:projectId",
        render: (props) => {
          const {
            location: {
              pathname,
            },
          } = props;

          // console.log("props", props);
          // console.log("props.location", props.location);

          return <ProjectPage
            key={pathname}
            where={{
              // uri: "/projects/dvazhdy-proekt",
              uri: pathname,
            }}
            {...props}
          />
        }
      },
      {
        exact: true,
        path: "/timers",
        component: TimersPage,
      },
      // {
      //   exact: true,
      //   path: "/timers/:timerId",
      //   render: (props) => {
      //     const {
      //       params,
      //     } = props.match;

      //     const {
      //       timerId,
      //     } = params || {};

      //     return <TimerPage
      //       key={timerId}
      //       where={{
      //         id: timerId,
      //       }}
      //       {...props}
      //     />
      //   }
      // },
      {
        exact: true,
        path: "/tasks",
        component: TasksPage,
      },
      {
        exact: false,
        path: [
          "/tasks/create/:projectId",
          // "/tasks/create",
        ],
        component: TaskCreatePage,
      },
      {
        exact: true,
        path: "/tasks/:taskId",
        render: (props) => {
          const {
            params,
          } = props.match;

          const {
            taskId,
          } = params || {};

          return <TaskPage
            key={taskId}
            where={{
              id: taskId,
            }}
            {...props}
          />
        }
      },
      {
        exact: true,
        path: "/eth-transactions",
        render: props => <TransactionsPage
          {...props}
          where={{}}
          first={10}
          orderBy="createdAt_DESC"
        />
      },
      {
        exact: true,
        path: "/eth-transactions/:transactionId",
        component: TransactionPage,
      },
      {
        path: "/react-lessons/lesson1",
        component: ReactLesson1,
      },
      {
        exact: true,
        path: "/chat-rooms",
        component: ChatRoomsPage,
      },
      {
        exact: true,
        path: "/chat-rooms/create",
        component: CreateChatRoomPage,
      },
      {
        exact: true,
        path: "/chat-rooms/:id",
        render: props => {

          const {
            match: {
              params: {
                id,
              },
            },
          } = props;

          return <ChatRoomPage
            key={id}
            where={{
              id,
            }}
            {...props}
          />
        },
      },
      {
        exact: true,
        path: "/chat-messages",
        component: ChatMessagesPage,
      },
      {
        exact: true,
        path: "/chat-messages/:id",
        render: props => {

          const {
            match: {
              params: {
                id,
              },
            },
          } = props;

          return <ChatMessagePage
            key={id}
            where={{
              id,
            }}
            {...props}
          />
        },
      },
      // {
      //   path: "*",
      //   render: props => this.renderOtherPages(props),
      // },
    ].concat(baseRoutes);



    // console.log("routes", routes);

    return routes;
  }


  renderMenu() {

    return <MainMenu />;
  }


  renderWrapper() {

    return <ResourceContextProvider>
      <ResourceSubscriptionProvider>
        <SocietyContextProvider>
          <SocietySubscriptionProvider>
            <EthereumContextProvider>
              <EthereumSubscriptionProvider>
                <WebrtcContextProvider>
                  <WebrtcSubscriptionProvider>
                    <WebRtcChatProvider>
                      <ContextProvider>
                        {super.renderWrapper()}
                      </ContextProvider>
                    </WebRtcChatProvider>
                  </WebrtcSubscriptionProvider>
                </WebrtcContextProvider>
              </EthereumSubscriptionProvider>
            </EthereumContextProvider>
          </SocietySubscriptionProvider>
        </SocietyContextProvider>
      </ResourceSubscriptionProvider>
    </ResourceContextProvider>

  }


  render() {

    const {
      user: currentUser,
      client,
      loadApiData,
    } = this.context;

    const {
      classes,
    } = this.props;

    return <div
      className={classes.root}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, body, #root {
              height: 100%;
            }
          `,
        }}
      />
      <SubscriptionProvider
        user={currentUser}
        client={client}
        loadApiData={loadApiData}
      >
        {super.render()}
      </SubscriptionProvider>
    </div>
  }

}

export default withStyles(styles)(props => <Renderer
  {...props}
/>);
