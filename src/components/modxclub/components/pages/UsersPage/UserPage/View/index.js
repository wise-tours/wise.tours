import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

// import EditableView from 'apollo-cms/lib/DataView/Object/Editable';

import PrismaCmsUserPageView from "@prisma-cms/front/lib/modules/pages/UsersPage/UserPage/View";

// import UserAvatar from './Avatar';

// import UserView from "@modxclub/old/view/profile";



// let propTypes = { ...EditableView.propTypes }
// let contextTypes = { ...EditableView.contextTypes }


// Object.assign(propTypes, {
//   // user: PropTypes.object.isRequired,
// });

// Object.assign(contextTypes, {
//   loadApiData: PropTypes.func.isRequired,
//   setPageMeta: PropTypes.func.isRequired,
// });


import NotificationTypes from "./NotificationTypes";
import { Typography } from 'material-ui';

export default class UserPageView extends PrismaCmsUserPageView {

  // static propTypes = propTypes;

  // static contextTypes = contextTypes;


  // setPageMeta() {

  //   const {
  //     setPageMeta,
  //   } = this.context;

  //   setPageMeta({
  //     title: this.getTitle(),
  //   });

  // }

  // componentWillMount() {

  //   this.setPageMeta();
  // }


  // componentDidUpdate() {

  //   this.setPageMeta();

  //   super.componentDidUpdate && super.componentDidUpdate();
  // }




  // getTitle() {

  //   const draftObject = this.getObjectWithMutations();

  //   const {
  //     username,
  //     fullname,
  //   } = draftObject || {};

  //   return fullname || username;
  // }



  // renderAvatar() {

  //   const draftObject = this.getObjectWithMutations();

  //   return <UserAvatar
  //     user={draftObject}
  //     updateUser={this.onUpdateAvatar}
  //     inEditMode={this.isInEditMode()}
  //   />
  // }


  // canEdit() {

  //   return false;
  // }


  // async save() {


  //   const result = await super.save()
  //     .then(r => {

  //       // console.log("onSave", r);

  //       const {
  //         loadApiData,
  //       } = this.context;

  //       loadApiData();

  //       return r;
  //     })
  //     .catch(e => {
  //       console.error(e);
  //     });

  //   return result;

  // }


  // onUpdateAvatar = (file) => {

  //   console.log("onUpdateAvatar", file);

  //   if (file) {

  //     const {
  //       id,
  //       path,
  //       mimetype,
  //     } = file;

  //     if (!path) {

  //       this.addError("File URL is empty");

  //       return;
  //     }

  //     if (!mimetype) {

  //       this.addError("Wrong file type");

  //     }
  //     else if (!mimetype.match(/image/)) {

  //       this.addError("Only images allow");

  //     }
  //     else {

  //       let image = path;

  //       this.updateObject({
  //         image,
  //       });

  //     }

  //   }
  //   else {

  //     this.addError("File did not received");

  //   }


  // }


  // state = {
  //   ...super.state,
  // }

  getEthWallet() {

    const object = this.getObjectWithMutations();

    let {
      ethWallet,
      EthAccounts,
    } = object;

    const {
      address,
    } = EthAccounts && EthAccounts[0] || {};

    return ethWallet || address;
  }


  renderDefaultView() {

    // return <UserView 
    //   {...this.props}
    // />

    const object = this.getObjectWithMutations();
    const inEditMode = this.isInEditMode();

    let {
      id,
      username,
      fullname,
      EthAccounts,
    } = object;

    const {
      mutate,
    } = this.props;

    const {
      user: currentUser,
    } = this.context;


    const {
      balance,
    } = EthAccounts && EthAccounts[0] || {};


    const {
      changePassword,
    } = this.state;

    const {
    } = currentUser || {}

    const ethWallet = this.getEthWallet();

    return <Grid
      container
      spacing={16}
    >

      <Grid
        item
      >

        {this.renderAvatar()}

      </Grid>

      <Grid
        item
        xs
      >

        <Grid
          container
          spacing={16}
        >

          <Grid
            item
            xs={12}
            md={6}
          >


            {ethWallet ?
              <Fragment>
                <Grid
                  item
                  xs={12}
                >

                  <Typography>
                    Кошелек: <a
                      href={`https://etherscan.io/address/${ethWallet}`}
                      target="_blank"
                    >
                      {ethWallet}
                    </a>
                  </Typography>

                  <Typography>
                    Баланс Eth: {balance}
                  </Typography>

                </Grid>
              </Fragment>
              : null
            }


          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >

            <NotificationTypes
              user={object}
              inEditMode={inEditMode}
              mutate={mutate}
            />

          </Grid>

        </Grid>

      </Grid>



    </Grid>;

  }

  renderEditableView() {


    // return <UserView 
    //   {...this.props}
    // />

    const object = this.getObjectWithMutations();
    const inEditMode = this.isInEditMode();

    const {
      id,
      username,
      fullname,
    } = object;


    const {
      mutate,
    } = this.props;

    const {
      user: currentUser,
    } = this.context;


    const {
      changePassword,
    } = this.state;

    const {
    } = currentUser || {}

    const ethWallet = this.getEthWallet();

    return <Grid
      container
      spacing={16}
    >

      <Grid
        item
      >

        {this.renderAvatar()}

      </Grid>

      <Grid
        item
        xs
      >

        <Grid
          container
          spacing={16}
        >

          <Grid
            item
            xs={12}
            md={6}
          >


            <Grid
              item
              xs={12}
            >

              {this.getTextField({
                name: "ethWallet",
                helperText: "Сменить ethereum кошелек",
                label: "Адрес кошелька",
                value: ethWallet || "",
              })}

            </Grid>


            <Grid
              item
              xs={12}
            >

              {this.getTextField({
                name: "fullname",
                helperText: "Отображаемое на сайте имя",
                label: "Имя",
              })}

            </Grid>


            <Grid
              item
              xs={12}
            >

              <input
                style={{
                  height: 1,
                  opacity: 1,
                  padding: 0,
                  margin: 0,
                  border: 0,
                }}
              />

              <div>
                {this.getTextField({
                  name: "password",
                  type: "password",
                  label: "Пароль",
                  helperText: "Новый пароль",
                })}
              </div>

            </Grid>


            <Grid
              item
              xs={12}
            >

              {this.getTextField({
                name: "email",
                helperText: "Сменить емейл",
                label: "Емейл",
              })}

            </Grid>

          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >

            <NotificationTypes
              user={object}
              inEditMode={inEditMode}
              mutate={mutate}
            />

          </Grid>

        </Grid>

      </Grid>



    </Grid>;

  }


}
