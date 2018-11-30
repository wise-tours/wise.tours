import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import EditableView from 'apollo-cms/lib/DataView/Object/Editable';

import withStyles from "material-ui/styles/withStyles";
import { Typography } from 'material-ui';


import Card, {
  CardContent,
  // CardActions,
  // CardHeader,
  CardMedia,
} from 'material-ui/Card';
import Button from 'material-ui/Button';
// import IconButton from 'material-ui/IconButton';
// import CompaniesList from '../../../fields/user/companies_list';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
// import TextField from 'material-ui/TextField';

// import EditIcon from 'material-ui-icons/ModeEdit';
// import MembersIcon from 'material-ui-icons/People';
// import SaveIcon from 'material-ui-icons/Save';

// import MembersListEditor from './memberslist';

import { Uploader } from "@prisma-cms/ui";


// import moment from "moment";

import {
  UserLink,
  ProjectLink,
  Link,
  Avatar,
  Grid,
} from "@modxclub/ui"


// import TasksListView from "../../../Tasks/View/List";
import TasksListView from "./Tasks/";


const styles = theme => {

  return {
    root: {
    },
    header: {
      padding: "15px 15px 0",
    },
    thumb: {
      width: "100%",
      maxWidth: 600,
      cursor: "pointer",
    },
    imageOpened: {
      maxWidth: "100%",
    },
    memberLinks: {
      "& > div": {
        marginRight: 10,
      },
    },
    inputRoot: {
      marginLeft: 24,
    },
  }

}

class ProjectView extends EditableView {


  static propTypes = {
    ...EditableView.propTypes,
    classes: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
    tasksLimit: PropTypes.number,
  };

  static defaultProps = {
    ...EditableView.defaultProps,
    showDetails: false,
  };

  static contextTypes = {
    ...EditableView.contextTypes,
    openLoginForm: PropTypes.func.isRequired,
  };


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


  save() {

    const {
      user: currentUser,
      openLoginForm,
    } = this.context;

    if (!currentUser) {

      return openLoginForm();
    }

    return super.save();
  }


  getCacheKey() {

    const {
      id,
    } = this.getObject() || {};

    return `project_${id || "new"}`;
  }



  handleOpen = (image) => {

    let thumb = image ? `/images/resized/big/${image}` : null;

    if (!thumb) {
      return false;
    }

    this.setState({
      open: true,
      openedImage: thumb,
    });
  };

  handleClose = () => {
    // console.log('handleClose', this);
    this.setState({
      open: false,
      openedImage: undefined,
    });
  };


  renderHeader() {

    return null;
  }



  onUpload(r) {

    const {
      singleUpload,
    } = r.data;


    // console.log("onUpload", singleUpload);

    const {
      path: image,
    } = singleUpload || {};

    if (singleUpload) {
      this.updateObject({
        image,
      });
    }

  }


  renderTasks() {

    const {
      id: projectId,
      Tasks,
    } = this.getObjectWithMutations() || {};

    const {
      tasksLimit,
    } = this.props;

    const showDetails = false;

    return Tasks && <CardContent>

      <Typography
        variant="subheading"
      >
        Задачи в проекте
      </Typography>

      <TasksListView
        tasks={Tasks}
        showDetails={showDetails}
        tasksLimit={tasksLimit}
      />

      <Link
        to={`/tasks/create/${projectId}`}
      >
        <Typography
        >
          Поставить задачу
        </Typography>
      </Link>

    </CardContent> || null;

  }


  renderDefaultView() {


    const {
      classes,
    } = this.props;

    const object = this.getObjectWithMutations();


    const inEditMode = this.isInEditMode();


    let {
      openedImage,
      editMembers,
    } = this.state;


    let {
      user: currentUser,
      // updateProject,
      // saveProject,
    } = this.context;


    if (!object) {
      return null;
    }

    let {
      id: projectId,
      name,
      url,
      companies,
      developer_id,
      developer_uri = "/",
      developer_title,
      createdby,
      Members,
      _isDirty,
      _errors,
      Resource,
      CreatedBy,

      image: newImage,
    } = object;

    const {
      Image,
    } = Resource || {}

    const {
      id: createdById,
      username: author_username,
      fullname: author_fullname,
      // author_photo,
      // author_thumb,
    } = CreatedBy || {};

    let {
      path: image,
    } = Image || {};

    image = newImage || image;

    let thumb = image ? `/images/resized/middle/${image}` : null;

    /*
     * Участники проекта
     * */
    let project_members = Members || []
    var members = [];

    if (inEditMode) {
      // members.push(<Chip
      //   key="create"
      //   className="link"
      //   style={{
      //     margin: 4,
      //   }}
      //   label={project_members.length ? "Редактировать участников" : "Добавить участника"}
      //   avatar={<MembersAvatar />}
      //   onClick={event => {
      //     this.setState({
      //       editMembers: true,
      //     });
      //   }}
      // >
      // </Chip>);
    }

    if (project_members.length) {
      project_members.map(function (member) {

        let {
          id,
          User,
        } = member;

        members.push(<UserLink
          key={id}
          user={User}
          size="small"
        />);
      }, this);
    }


    /*
     * Используемые компоненты
     * */
    var extras = [];

    if (object.extras && object.extras.length) {
      object.extras.map(function (extra) {


        extras.push(<Chip
          key={extra.id}
          style={{
            margin: 4,
          }}
          label={extra.pagetitle}
        >
        </Chip>);
      }, this);
    }

    var dialog_actions = [];

    if (this.state.url != '') {
      dialog_actions.push(
        <Button
          key="link"
          href={this.state.url}
          target="_blank"
          rel="nofollow"
          secondary={true}
        >Перейти на сайт</Button>
      );
    }

    dialog_actions.push(
      <Button
        key="close"
        onClick={this.handleClose}
      >Закрыть</Button>
    );


    return <Card
      className="portfolio-card__wrapper"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      {/* <CardHeader
        title={<Link
          to={`/profile/${author_username}`}
          style={{
            textDecoration: 'none',
          }}
        >
          {author_fullname || author_username}
        </Link>}
        // subheader={companies && <CompaniesList companies={companies} /> || undefined}
        avatar={<div>

          {this.getButtons()}

          {CreatedBy ?
            <UserLink
              user={CreatedBy}
            /> : null
          }

        </div>}
      /> */}

      <div
        className={classes.header}
      >
        <Grid
          container
          spacing={8}
          alignItems="center"
        >

          <Grid
            item
            xs={inEditMode}
          >

            {/* {inEditMode
              ?
              this.getTextField({
                name: "name",
                fullWidth: true,
              })
              :

              projectId ? <ProjectLink
                object={object}
              />
                :
                null
            } */}

          </Grid>

          <Grid
            item
          >


            {this.getButtons()}

          </Grid>


          <Grid
            item
            xs={!inEditMode}
          >

          </Grid>


          <Grid
            item
          >
            {CreatedBy
              ?
              <UserLink
                user={CreatedBy}
              />
              :
              null
            }
          </Grid>

        </Grid>
      </div>


      <CardContent>

        {inEditMode
          ?

          this.getTextField({
            label: "Название проекта",
            name: "name",
          })

          :
          <Typography
            variant="title"
            style={{
              // textAlign: 'right',
              padding: 3,
            }}
          >

            <ProjectLink
              object={object}
            // title={longtitle}
            // className="underline-none"
            >
              <Typography
                variant="title"
              >
                {name}
              </Typography>
            </ProjectLink>
          </Typography>
        }

      </CardContent>

      <CardMedia
      >

        <div
          className="overlay"
        >

          {inEditMode && currentUser ?
            <Uploader
              onUpload={result => this.onUpload(result)}
              inEditMode={inEditMode}
              helperText="Для загрузки перетащите файл сюда"
              classes={{
                inputRoot: classes.inputRoot,
              }}
            >
            </Uploader>
            : null
          }

          <img
            className={classes.thumb}
            src={thumb}
            onClick={event => {
              this.handleOpen(image);
            }}
          />
        </div>






      </CardMedia>

      <CardContent>

        {inEditMode
          ?

          this.getTextField({
            label: "URL-адрес сайта",
            name: "url",
          })

          :
          <Typography
            variant="subheading"
            style={{
              textAlign: 'right',
              padding: 5,
            }}
          >

            {url
              ?
              <a
                href={url}
                target="_blank"
                title={name}
              >{url}</a>
              :
              null
            }
          </Typography>
        }

        {object.content}


      </CardContent>


      {developer_id
        ?
        <CardContent>

          Компания-разработчик
                <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to={developer_uri}
              style={{
                textDecoration: 'none',
              }}
              title={developer_title}
            >
              <Chip
                label={developer_title}
                className="link"
              />
            </Link>
          </div>
        </CardContent>
        :
        null
      }


      {members && members.length
        ?
        <CardContent>

          <Typography
            variant="subheading"
          >
            Участники проекта {editMembers
              ?
              <Button
                onClick={event => {
                  this.setState({
                    editMembers: false,
                  })
                }}
              >
                Скрыть детали
              </Button>
              :
              null
            }
          </Typography>

          <div
            className={classes.memberLinks}
          >

            {members}

          </div>
        </CardContent>
        :
        null
      }


      {this.renderTasks()}



      {extras.length ?
        <CardContent>
          Используемые компоненты
              <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {extras}
          </div>
        </CardContent>
        : null}


      <Dialog
        title={name}
        onClose={this.handleClose}
        modal={false}
        contentStyle={{
          maxWidth: '100%',
        }}
        open={this.state.open && openedImage ? true : false}
        autoScrollBodyContent={true}
        actions={dialog_actions}
      >
        <img
          className={classes.imageOpened}
          src={openedImage}
          style={{
            // minHeight: typeof window != "undefined" ? window.innerHeight * 0.8 : undefined,
          }}
        />
      </Dialog>
    </Card>

  }



  renderEditableView() {

    return this.renderDefaultView();

  }



  renderResetButton() {

    const {
      id,
    } = this.getObjectWithMutations() || {}

    return id ? super.renderResetButton() : null;
  }



  // render() {

  //   const object = this.getObjectWithMutations();

  //   if (!object) {
  //     return null;
  //   }

  //   const {
  //     classes,
  //   } = this.props;

  //   return <div
  //     className={classes.root}
  //   >

  //     {super.render()}

  //   </div>

  // }
}


export default withStyles(styles)(ProjectView);