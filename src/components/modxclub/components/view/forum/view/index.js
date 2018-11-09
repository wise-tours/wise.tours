import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withStyles from "material-ui/styles/withStyles";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";

import moment from "moment";

import Header from "./header";

import {
  styles,
  TableView,
} from "@modxclub/ui/src/list-view";

import {
  BlogLink,
  UserLink,
  TopicLink,
  TagLink,
} from "@modxclub/ui";


let customStyles = theme => {

  const {
    palette: {
      background: {
        default: defaultBackground,
      },
    },
  } = theme;

  return {
    ...styles(),

    tags: {
      marginTop: 5,
    },

    usersWrapper: {
      whiteSpace: "nowrap",
      display: "flex",
      alignItems: "end",
    },
    member: {
      padding: 2,
    },
    topicColumn: {
      width: "70%",
    },
    alignCenter: {
      textAlign: "center",
    },
  }

}


class ForumView extends TableView {


  // static propTypes = {

  // };

  static defaultProps = {
    ...TableView.defaultProps,
    title: "",
    columnData: [],
    // Header,
    Toolbar: () => (null),
  }



  constructor(props){

    super(props);

    console.log("ForumView constructor", this);

  }



  getColumns() {

    const {
      classes,
      data: {
        variables: {
          where,
        },
      },
    } = this.props;


    const {
      tag: activeTag,
    } = where || {};

    let columns = [
      {
        id: "topic",
        label: "Топик",
        className: classes.topicColumn,
        renderer: (value, record) => {

          console.log("Topic record", record);

          const {
            id: topicId,
            name,
            uri,
            Tags,
          } = record;


          let tagsList = [];

          Tags && Tags.map(tag => {

            const {
              id,
              name,
            } = tag;

            tagsList.push(<TagLink
              key={id}
              object={tag}
              color="textSecondary"
              className={[classes.tag].join(" ")}
              textClassName={[activeTag === name ? "active" : ""].join(" ")}
            />);
          });

          return <div>

            <TopicLink
              object={record}
            >
              <Typography
                variant="subheading"
              >
                {name}
              </Typography>
            </TopicLink>

            <div
              className={classes.tags}
            >
              {tagsList}
            </div>
          </div>;
        },
      },
      {
        id: "Blog",
        label: "Блог",
        className: classes.alignCenter,
        renderer: (value, record) => {

          if(!value){
            return null;
          }

          const {
            id: blogId,
            name,
          } = value;


          // return value && <BlogLink
          //   object={value}
          // >
          //   <Button
          //     size="small"
          //     color="secondary"
          //   // noWrap={false}
          //   >
          //     {name}
          //   </Button>
          // </BlogLink> || null;

          return value && <BlogLink
            object={value}
            variant="button"
          >
            {name}
          </BlogLink> || null;
        },
      },
      {
        id: "users",
        label: "Участники",
        className: classes.alignCenter,
        renderer: (value, record) => {

          let users = [];

          const {
            CreatedBy,
            Comments,
          } = record;

          let limit = 5;

          Comments && Comments.map(n => {

            const {
              CreatedBy,
            } = n;

            if (users.length >= limit || users.findIndex(n => n.id === CreatedBy.id) !== -1) {
              return;
            }

            users.push(CreatedBy);

          });


          if (users.length < limit && users.findIndex(n => n.id === CreatedBy.id) === -1) {
            users.push(CreatedBy);
          }

          return <div
            className={classes.usersWrapper}
          >
            {users.map(n => {

              const {
                id,
              } = n;

              return <UserLink
                key={id}
                user={n}
                showName={false}
                size="small"
                className={classes.member}
              />

            })}
          </div>;
        },
      },
      {
        id: "Comments",
        label: "Комментарии",
        className: classes.alignCenter,
        renderer: (value, record) => {

          return value && value.length || 0;
        },
      },
      {
        id: "activity",
        label: "Активность",
        className: classes.alignCenter,
        renderer: (value, record) => {

          let activity;

          const {
            createdAt,
            updatedAt,
            Comments,
          } = record;

          let date = moment(updatedAt || createdAt);


          let latestComment = Comments && Comments[0];

          if (latestComment && latestComment.createdAt) {

            const commentDate = moment(latestComment.createdAt);

            if (commentDate > date) {
              date = commentDate;
            }

          }


          return date.fromNow();
        },
      },
    ]

    return columns;

  }

}


export {
  customStyles as styles,
  ForumView as TableView,
}


export default withStyles(customStyles)(ForumView);