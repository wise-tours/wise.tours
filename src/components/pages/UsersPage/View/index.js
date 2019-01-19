import React, { Fragment } from 'react'
// import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

import {
  styles,
  UsersPageView as PrismaCmsUsersPageView,
} from '@prisma-cms/front/lib/modules/pages/UsersPage/View';

 
import {
  Pagination,
  UserLink,
} from '@modxclub/ui';

import moment from 'moment';

 
export class UsersPageView extends PrismaCmsUsersPageView {
 

  static defaultProps = {
    ...PrismaCmsUsersPageView.defaultProps,
    columnData: [
      {
        id: 'username',
        numeric: false,
        disablePadding: false,
        label: 'User',
        renderer: (value, record) => {
 

          return <UserLink
            user={record}
          />;
 

        }
      },
      {
        id: 'created_at',
        numeric: false,
        disablePadding: false,
        label: 'Reg date',
        renderer: (value, record) => {
 

          return value ? moment(value).format("LL") : "";

        }
      },
    ],
  };

 

}


export default withStyles(styles)(props => <UsersPageView {...props}/>);