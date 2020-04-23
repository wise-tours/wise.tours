import React from 'react';


import EditableView from 'apollo-cms/lib/DataView/Object/Editable';

// import Card, {
//   CardHeader,
//   CardContent,
//   CardMedia,
//   CardActions,
// } from 'material-ui/Card';

import withStyles from 'material-ui/styles/withStyles';

import moment from "moment";

import {
  UserLink,
} from "@modxclub/ui"


// import TextEditor from "@modxclub/react-editor";
import Editor from "@modxclub/react-editor";
import Typography from 'material-ui/Typography';

import Grid from "@prisma-cms/front/lib/modules/ui/Grid";

import CommentsView from "./Comments";
import Blog from "./Blog";

const styles = {
  root: {

    marginTop: 15,
    marginBottom: 30,

    '& pre': {
      whiteSpace: 'pre-line',
    },
  },
  bullet: {
  },
  header: {
    // '& a': {
    //   textDecoration: 'none',
    // },
    marginBottom: 30,
  },
}


class TopicView extends EditableView {


  static defaultProps = {
    ...EditableView.defaultProps,
  }

  canEdit() {

    const {
      user: currentUser,
    } = this.context;

    const {
      id: currentUserId,
      sudo,
    } = currentUser || {};


    const {
      id,
      CreatedBy,
    } = this.getObjectWithMutations() || {};


    const {
      id: createdById,
    } = CreatedBy || {}

    return !id || (createdById && createdById === currentUserId) || sudo === true;

  }


  getCacheKey() {

    const {
      id,
    } = this.getObject() || {};

    return `topic_${id || "new"}`;
  }



  addMessage = () => {



  }



  renderHeader() {

    const {
      classes,
    } = this.props;

    const object = this.getObjectWithMutations();

    const {
      CreatedBy,
      createdAt,
    } = object || {}



    const inEditMode = this.isInEditMode();

    return <div
      className={classes.header}
    >
      <Grid
        container
        spacing={16}
      >

        {CreatedBy
          ?
          <Grid
            item
          >

            <UserLink
              user={CreatedBy}
              showName={false}
              avatarProps={{
                size: "medium",
              }}
            />
          </Grid>
          : null
        }

        <Grid
          item
        >
          {CreatedBy
            ?
            <UserLink
              user={CreatedBy}
              withAvatar={false}
            />
            :
            null
          }

          {createdAt ? <Typography
            variant="caption"
            color="textSecondary"
          >
            {moment(createdAt).format('lll')}
          </Typography> : null}

        </Grid>

        <Grid
          item
          xs={12}
        >

          <Grid
            container
            spacing={16}
            alignItems="center"
          >

            <Grid
              item
              xs
            >


              {inEditMode ? this.getTextField({
                name: "name",
                label: "Название топика",
                helperText: "Укажите название топика",
              }) :
                <Typography
                  variant="display1"
                  component="h1"
                >
                  {this.getTitle()}

                </Typography>
              }

            </Grid>

            <Grid
              item
            >

              <Blog
                Topic={object}
                updateObject={data => this.updateObject(data)}
                inEditMode={inEditMode}
              />

            </Grid>

            <Grid
              item
            >
              {this.getButtons()}

            </Grid>


          </Grid>


          {/* {inEditMode && !topicId ? this.getTextField({
            name: "topic_tags",
            label: "Теги",
            helperText: "Перечислите теги через запятую",
            value: topic_tags && topic_tags.join(",") || "",
            onChange: event => {

              const {
                name,
                value,
              } = event.target;

              this.updateObject({
                [name]: value && value.split(",").map(n => n && n.trim() || "") || [],
              });

            }
          }) : null} */}

        </Grid>


      </Grid>
    </div>

  }


  renderDefaultView() {

    const object = this.getObjectWithMutations();

    if (!object) {
      return null;
    }



    const {
      classes,
    } = this.props;

    const {
      content,
    } = object;

    const inEditMode = this.isInEditMode();

    const allow_edit = this.canEdit();

    return <div
      className={classes.root}
    >

      <div>

        <Editor
          className="topic-editor"
          content={content}
          inEditMode={inEditMode || false}
          readOnly={inEditMode ? false : true}
          fullView={true}
          allow_edit={allow_edit}
          onChange={(rawContent) => {



            this.updateObject({
              content: rawContent,
            });

          }}
        />


      </div>

      <CommentsView
        topic={object}
      />

    </div>;

  }


  renderEditableView() {

    return this.renderDefaultView();

  }

}


export default withStyles(styles)(props => <TopicView
  {...props}
/>);