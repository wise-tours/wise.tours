

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PrismaCms from "@prisma-cms/front";

import registerServiceWorker from './registerServiceWorker';

import App from "./App";


ReactDOM.render(<PrismaCms
  App={App}
  apolloOptions={{
    apiQuery: `{
      user:me{
        id
        username
        fullname
        profileId
        sudo
        image
        email
        hasEmail
        createdAt
        works
        api_key
        balance
      } 
    }`,
  }}
/>, document.getElementById('root'));
registerServiceWorker();

