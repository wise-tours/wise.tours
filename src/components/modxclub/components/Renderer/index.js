
import React from "react";

import PropTypes from "prop-types";


import PrismaRendererCmsRenderer from "../../../Renderer";

import withStyles from "material-ui/styles/withStyles";

import MainMenu from "../menu/mainMenu";



import MainPage from "../pages/MainPage";
// import UsersPage from "@prisma-cms/front/lib/modules/pages/UsersPage";
import UsersPage from "../pages/UsersPage/";
import UserPage from "../pages/UsersPage/UserPage";
import TopicPage from "../pages/Topics/Topic";
import TopicCreatePage from "../pages/Topics/Topic/Create";
import TagPage from "../pages/Tags/Tag";
import BlogPage from "../pages/Blogs/Blog";
import CommentsPage from "../pages/Comments";
import CommentPage from "../pages/Comments/Comment";

import SubscriptionProvider from "./SubscriptionProvider";


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

      height: "100vh",
      display: "flex",
      flexDirection: "column",
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


export class Renderer extends PrismaRendererCmsRenderer {

  static contextTypes = {
    ...PrismaRendererCmsRenderer.contextTypes,
    getQueryFragment: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    loadApiData: PropTypes.func.isRequired,
  }

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
        path: ["/", "/topics"],
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


  render() {

    const {
      user: currentUser,
      client,
      loadApiData,
    } = this.context;

    return <SubscriptionProvider
      user={currentUser}
      client={client}
      loadApiData={loadApiData}
    >
      {super.render()}
    </SubscriptionProvider>
  }

}

export default withStyles(styles)(Renderer);
