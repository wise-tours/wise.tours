import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Typography, Paper, Checkbox } from 'material-ui';
import { withStyles } from 'material-ui';

import WalletIcon from "material-ui-icons/AccountBalanceWallet";
import HelpIcon from "material-ui-icons/Help";

import { Grid } from 'material-ui';
import { Button } from 'material-ui';

import PrismaCmsComponent from "@prisma-cms/component";
import { TextField } from 'material-ui';


import {
  updateUserProcessor,
} from "@modxclub/query";

import Web3 from "web3";

export const styles = theme => {

  console.log(theme);
  return {
    root: {
      padding: 10,
    },
    icon: {
      color: theme.palette.primary[400],
    },
    actions: {
      marginTop: 15,
    },
    title: {
      marginBottom: 10,
    },
    paragraph: {
      marginTop: 10,
      marginBottom: 10,
    },
  }
}

export class WalletBalances extends PrismaCmsComponent {


  static propTypes = {
    ...PrismaCmsComponent.propTypes,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    ethAccount: PropTypes.object,
    children: PropTypes.any,
  };


  static contextTypes = {
    ...PrismaCmsComponent.contextTypes,
    user: PropTypes.object,
  }


  state = {
    ...super.state,
    showTopupBalanceForm: true,

    showForm: null,

    createInRequest: false,
    ethWalletPKSendEmail: true,

    showInfo: false,
  }


  async importWallet() {

    const {
      createInRequest,
      ethWalletPK,
      ethWalletPKSendEmail,
    } = this.state;


    if (createInRequest) {
      return false;
    }

    this.setState({
      createInRequest: true,
    });


    await this.mutate({
      mutation: updateUserProcessor,
      variables: {
        data: {
          ethWalletPK,
          ethWalletPKSendEmail,
        },
      },
    })
      .then(r => {

        this.setState({
          showForm: null,
          ethWalletPK: null,
        });
      })
      .catch(console.error);


    this.setState({
      createInRequest: false,
    });

  }


  async createWallet() {

    const web3 = new Web3();

    const account = web3.eth.accounts.create(web3.utils.randomHex(32));

    console.log("account", account);

    if (!account) {
      this.addError("Не удалось создать кошелек");
    }
    else {

      const {
        privateKey: ethWalletPK,
      } = account;

      this.setState({
        ethWalletPK,
        showForm: "importForm",
        ethWalletPKSendEmail: true,
      });

    }

  }


  render() {

    const {
      user,
      ethAccount,
      classes,
      children,
      ...other
    } = this.props;

    const {
      user: currentUser,
    } = this.context;

    const {
      address,
      balance,
    } = ethAccount || {};


    if (!user) {
      return null;
    }

    const {
      showTopupBalanceForm,
      showForm,
      ethWalletPK,
      ethWalletPKSendEmail,
      createInRequest,
      showInfo,
    } = this.state;


    const {
      id: currentUserId,
    } = currentUser || {};


    const {
      id: userId,
    } = user;


    let title;


    if (currentUserId && currentUserId === userId) {
      title = "Ваш кошелек";
    }
    else {
      title = "Кошелек пользователя";
    }


    let output;

    let actions = [];


    if (ethAccount) {

      output = <Fragment>


        <Typography>
          Адрес: <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
          >
            {address}
          </a>
        </Typography>

        <Typography>
          Баланс Eth: {balance}
        </Typography>

      </Fragment>


      if (currentUserId && currentUserId === userId) {


        /**
         * Если нет кошелька, предлагаем завести
         */

        if (ethAccount) {

        }
        else {


          actions.push(<Button
            onClick={event => this.setState({
              showTopupBalanceForm: true,
            })}
          >
            Пополнить
          </Button>);

          if (showTopupBalanceForm) {

            actions.push(<div>
              <Typography
                variant="subheading"
                color="secondary"
              >
                Внимание!
              </Typography>


              <Typography>
                Несколько ключевых моментов:
              </Typography>

              <Typography>
                1. Пополнить вы
              </Typography>

            </div>);

          }

        }

      }

    }
    else if (currentUserId && currentUserId === userId) {

      /**
       * Если кошелька нет и это текущий пользователь, предлагаем создать кошелек
       */


      let form;


      if (showForm) {



        switch (showForm) {

          case "createForm":

            form = <div
              className={classes.paragraph}
            >

              <Typography>
                Для вас будет создан новый ethereum-кошелек. В базе сохранится только его публичный адрес, без каких-либо ключей доступа.
              </Typography>

              <Button
                size="small"
                variant="raised"
                onClick={event => this.createWallet()}
              >
                Сгенерировать приватный ключ
              </Button>

            </div>

            break;


          case "importForm":

            form = <div
              className={classes.paragraph}
            >

              {this.renderField(<TextField
                name="ethWalletPK"
                label="Приватный ключ"
                helperText="По приватному ключу будет получен адрес"
                fullWidth
                onChange={event => {
                  const {
                    name,
                    value,
                  } = event.target;
                  this.setState({
                    [name]: value,
                  });
                }}
                value={ethWalletPK || ""}
              />)}

              <div>
                <Checkbox
                  name="ethWalletPKSendEmail"
                  checked={ethWalletPKSendEmail ? true : false}
                  onChange={(event, checked) => {
                    this.setState({
                      ethWalletPKSendEmail: checked,
                    })
                  }}
                /> отправить данные на вашу почту
              </div>

              <Button
                size="small"
                variant="raised"
                disabled={!ethWalletPK || createInRequest}
                onClick={event => this.importWallet()}
              >
                Отправить
              </Button>


            </div>

            break;

        }

      }



      output = <div>

        <Typography
          className={classes.paragraph}
        >
          У вас еще нет кошелька, но вы можете его <a
            href="javascript:;"
            onClick={event => {
              event.preventDefault();

              this.setState({
                showForm: showForm === "createForm" ? null : "createForm",
              });
            }}
          >
            создать
          </a> или <a
            href="javascript:;"
            onClick={event => {
              event.preventDefault();

              this.setState({
                showForm: showForm === "importForm" ? null : "importForm",
              });
            }}
          >
            указать существующий
          </a>.
        </Typography>

        {form}


        {form ?
          <Typography
            className={classes.paragraph}
          >
            <Typography
              color="secondary"
              component="span"
            >
              Внимание!
            </Typography> MODX-Клуб не несет никакой ответственности за какие-либо операции и потери с ethereum-кошельков.
          </Typography>
          : null
        }


        <Grid
          container
          alignItems="center"
        >
          <HelpIcon
            color="primary"
          /> <a
            href="javascript:;"
            onClick={event => {
              event.preventDefault();

              this.setState({
                showInfo: !showInfo,
              });
            }}
          >
            {showInfo ? "Закрыть" : "Читать подробней"}
          </a>.
        </Grid>

        {showInfo ?
          <div>


            <Typography
              className={classes.paragraph}
            >
              Данный кошелек не является кошельком в прямом смысле слова, а является ссылкой на ваш личный адрес в системе <a
                href="https://www.ethereum.org/"
                target="_blank"
                rel="nofollow"
              >
                ethereum
              </a> (подробнее в <a
                href="https://ru.wikipedia.org/wiki/Ethereum"
                target="_blank"
                rel="nofollow"
              >википедии</a>).
            </Typography>

            <Typography
              className={classes.paragraph}
            >
              Если вы не назнаете точно, что это такое и как работает, вам лучше стоит его заводить сейчас, а попытаться получше узнать о этой системе.
            </Typography>

            <Typography
              className={classes.paragraph}
            >
            </Typography>

            <Typography
              color="secondary"
              className={classes.paragraph}
            >
              Мы не храним ваши приватные ключи. Ключ нужен только для того, чтобы получить адрес вашего кошелька и убедиться,
              что у вас есть к нему доступ. Никому ключ не будет показан.
            </Typography>


          </div> : null
        }





      </div>;

    }
    else {
      return null;
    }





    if (!output) {
      return null;
    }


    return super.render(<Paper
      className={classes.root}
      {...other}
    >

      <Grid
        container
        alignItems="center"
        className={classes.title}
      >
        <WalletIcon
          className={classes.icon}
        />   <Typography
          variant="subheading"
        >
          {title}
        </Typography>
      </Grid>



      {output}


      {actions && actions.length ?
        <div
          className={classes.actions}
        >
          {actions}
        </div>
        : null
      }

      {children}

    </Paper>);
  }
}


export default withStyles(styles)(WalletBalances);