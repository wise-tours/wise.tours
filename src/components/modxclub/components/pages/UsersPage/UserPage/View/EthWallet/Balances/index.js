import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Typography, Paper, Checkbox, IconButton, CircularProgress } from 'material-ui';
import { withStyles } from 'material-ui';

import WalletIcon from "material-ui-icons/AccountBalanceWallet";
import HelpIcon from "material-ui-icons/Help";
import CheckIcon from "material-ui-icons/Check";
import SendIcon from "material-ui-icons/Send";

import { Grid } from 'material-ui';
import { Button } from 'material-ui';

import PrismaCmsComponent from "@prisma-cms/component";
import { TextField } from 'material-ui';

import NumberFormat from 'react-number-format';

import {
  updateUserProcessor,
  createEthTransactionProcessor,
} from "@modxclub/query";

import Web3 from "web3";

export const styles = theme => {

  // console.log(theme);
  return {
    root: {
      padding: 10,
      "&.success": {
        border: "2px solid green",
      },
      "&.failure": {
        border: "2px solid red",
      },
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
    textSuccess: {
      color: "green",
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
    loadApiData: PropTypes.func.isRequired,
    TransactionLink: PropTypes.func.isRequired,
  }


  state = {
    ...super.state,
    showTopupBalanceForm: false,
    showForm: null,
    createInRequest: false,
    ethWalletPKSendEmail: true,
    showInfo: false,
    checkStatus: null,
    showSendEthForm: true,
    sendEthInRequest: false,
    amount: null,
    sendSuccessTransaction: null,
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
      .then(async r => {

        const {
          loadApiData,
        } = this.context;

        await loadApiData();

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

    // console.log("account", account);

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


  checkWallet() {


    const {
      ethAccount,
    } = this.props;

    const {
      address,
    } = ethAccount || {};


    const {
      ethWalletPKCheck,
    } = this.state;


    let checkStatus;
    let errorMessage;


    const web3 = new Web3();

    let account;

    if (ethWalletPKCheck && !/^0x/.test(ethWalletPKCheck)) {
      errorMessage = "Приватный ключ должен начинаться с 0x";
      checkStatus = false;
    }
    else {

      try {
        account = web3.eth.accounts.privateKeyToAccount(ethWalletPKCheck);
      }
      catch (error) {
        // console.error("privateKeyToAccount Error", error);

        errorMessage = "Не удалось дешифровать приватный ключ";
        checkStatus = false;

      }


      if (account) {

        if (address !== account.address) {
          errorMessage = "Полученный адрес не совпадает с адресом вашего кошелька";
          checkStatus = false;
        }
        else {
          checkStatus = true;
        }

      }
      else {
        errorMessage = "Не был получен аккаунт";
        checkStatus = false;
      }

    }



    if (errorMessage) {
      this.addError(errorMessage);
    }

    this.setState({
      checkStatus,
    });

  }


  async sendEth() {

    const {
      amount,
      sendEthInRequest,
    } = this.state;


    const {
      ethAccount,
    } = this.props;

    const {
      address,
    } = ethAccount || {};

    if (sendEthInRequest) {
      return;
    }

    this.setState({
      sendEthInRequest: true,
    });


    await this.mutate({
      mutation: createEthTransactionProcessor,
      variables: {
        data: {
          type: "SendEth",
          privateKey: "0x71ff1d913dff53ea7c688437ae0b89bfb3027622ea2e7afc3d8012864bbec9b5",
          params: [
            address,
            amount,
          ],
        }
      },
    })
      .then(result => {

        console.log("result", result);

        const {
          response,
        } = result.data || {};

        if (response) {

          const {
            success,
            data: transaction,
          } = response;


          if (success && transaction) {

            this.setState({
              sendSuccessTransaction: transaction,
              amount: null,
            });

          }

        }

      })
      .catch(error => {
        console.error(error);
      });

    this.setState({
      sendEthInRequest: false,
    });

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
      TransactionLink,
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
      ethWalletPKCheck,
      checkStatus,
      showSendEthForm,
      amount,
      sendEthInRequest,
      sendSuccessTransaction,
    } = this.state;


    const {
      id: currentUserId,
      EthAccounts: currentUserEthAccounts,
    } = currentUser || {};


    const currentUserEthAccount = currentUserEthAccounts && currentUserEthAccounts[0] || null;

    const {
      balance: currentUserBalance,
    } = currentUserEthAccount || {}


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

      if (currentUserId) {

        if (currentUserId === userId) {


          /**
           * Пополнение баланса
           */

          if (showTopupBalanceForm) {

            actions.push(<div
              key="topupBalance"
            >
              <Typography
                variant="subheading"
                color="secondary"
              >
                Внимание!
              </Typography>

              <Typography
                className={classes.paragraph}
              >
                Пополняется ваш личный этериум-кошелек. Баланс будет отображаться на сайте Клуба, но мы никак не контролируем ваш кошелек и действия с ним.
              </Typography>

              <Typography
                className={classes.paragraph}
              >
                Введите ваш приватный ключ, чтобы убедиться, что у вас есть доступ к вашему кошельку. Иначе вы переведете средства и не сможете их потом забрать.
              </Typography>

              <Grid
                container
                alignItems="center"
              >
                <Grid
                  item
                  xs
                >
                  {this.renderField(<TextField
                    name="ethWalletPKCheck"
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
                        checkStatus: null,
                      });
                    }}
                    value={ethWalletPKCheck || ""}
                  />)}
                </Grid>
                <Grid
                  item
                >
                  <IconButton
                    disabled={!ethWalletPKCheck}
                    onClick={event => this.checkWallet()}
                  >
                    <CheckIcon />
                  </IconButton>
                </Grid>
              </Grid>


              <Typography
                className={classes.paragraph}
              >
                Мы не принимаем оплату на пополнение кошелька. Для пополнения вы можете выбрать любой сервис для покупки криптовалюты ethereum.
              </Typography>

              <Typography
                className={classes.paragraph}
              >
                Мы советуем воспользоваться сервисом <a
                  href="https://pocket-exchange.com/?ref_hash=685f16b842e617cb7814eff46d386fb6"
                  target="_blank"
                  rel="nofollow"
                >
                  pocket-exchange.com
                </a>, так как у них минимальная сумма пополнения всего 0.01 этериума, и сами оплачивали, они не обманывали.
              </Typography>

            </div>);

          }



          actions.push(<Button
            key="showTopupBalanceForm"
            onClick={event => this.setState({
              showTopupBalanceForm: !showTopupBalanceForm,
            })}
          >
            {!showTopupBalanceForm ? "Пополнить" : "Отмена"}
          </Button>);

        }
        else {

          if (showSendEthForm) {

            if (sendSuccessTransaction) {

              const {
                id,
              } = sendSuccessTransaction;

              actions.push(<div
                key="ethSendedSuccess"
              >

                <Typography
                  className={classes.textSuccess}
                >
                  Перевод успешно выполнен.
                </Typography>

                <Typography
                >
                  Посмотреть данные транзакции можно <TransactionLink
                    object={sendSuccessTransaction}
                  >
                    здесь
                  </TransactionLink>.
                </Typography>

              </div>);

            }
            else if (currentUserEthAccount) {

              /**
               * Проверяем достаточно ли баланса
               */
              // if (!currentUserBalance) {
              //   actions.push(<div
              //     key="sendEthFormNoAmount"
              //   >

              //     <Typography
              //       color="secondary"
              //     >

              //     </Typography>

              //   </div>)
              // }
              // else {

              let error;
              let helperText = "Внимательно перепроверьте сумму";

              if (!currentUserBalance || currentUserBalance < amount) {
                error = true;
                helperText = "Недостаточно баланса. Пополните свой кошелек.";
              }

              const disabled = error || !amount ? true : false;

              actions.push(<div
                key="sendEthForm"
              >
                <Grid
                  container
                  alignItems="center"
                >

                  <Grid
                    item
                    xs
                  >
                    {/* {this.renderField(<TextField
                      label="Сумма в Eth"
                      name="amount"
                      helperText={helperText}
                      fullWidth
                      error={error}
                      onChange={event => {
                        const {
                          name,
                          value,
                        } = event.target;
                        this.setState({
                          [name]: value,
                        });
                      }}
                      value={amount || ""}
                    />)} */}

                    {this.renderField(<NumberFormat
                      customInput={TextField}
                      label="Сумма в Eth"
                      name="amount"
                      helperText={helperText}
                      fullWidth
                      error={error}
                      onChange={event => {
                        const {
                          name,
                          value,
                        } = event.target;
                        this.setState({
                          [name]: value,
                        });
                      }}
                      value={amount || ""}
                    />)}
                  </Grid>

                  <Grid
                    item
                  >
                    {sendEthInRequest ?
                      <CircularProgress

                      />
                      :
                      <IconButton
                        disabled={disabled}
                        onClick={event => this.sendEth()}
                      >
                        <SendIcon
                          style={{
                            color: !disabled ? "green" : undefined,
                          }}
                        />
                      </IconButton>
                    }
                  </Grid>

                </Grid>
              </div>);
              // }


            }
            else {
              actions.push(<div
                key="sendEthNoAccount"
              >
                <Typography
                  color="secondary"
                >
                  У вас еще нет своего кошелька. Создайте его в форме ниже.
                </Typography>
              </div>)
            }

          }

          actions.push(<Button
            key="sendEth"
            onClick={event => this.setState({
              showSendEthForm: !showSendEthForm,
            })}
          >
            {showSendEthForm ? "Отмена" : "Отправить Eth"}
          </Button>);
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
      className={[classes.root, checkStatus === true ? "success" : checkStatus === false ? "failure" : ""].join(" ")}
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