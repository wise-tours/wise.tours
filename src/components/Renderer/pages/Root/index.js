import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import PrismaCmsComponent from "@prisma-cms/component";
import RootConnector from '@prisma-cms/front-editor/lib/components/Root';
import UserPage from './components/pages/Users/User';
import OldPageHeader from './components/OldPageHeader';
import OldPages from './components/pages/OldPages';
// import SwitchTemplateLink from './components/Link/SwitchTemplate';
// import PdfView from './components/PdfView';
import CreateUserPage from './components/pages/Users/User/Create';
import Topic from './components/Resource/Topic';
import ResourceFields from './components/Resource/Fields';
import ResourceContent, { RichTextCustom } from './components/Resource/Fields/Field/ResourceContent';
import Comments from './components/Resource/Comments';
import TopicBlog from './components/Resource/Topic/TopicBlog';
import Youtube from './components/Resource/Fields/Field/Youtube';
import ChatRooms from './components/pages/ChatRooms';
import ChatRoom from './components/pages/ChatRooms/ChatRoom';
import JoinUserTechnologyButton from './components/JoinUserTechnologyButton';
import ViewIcon from './components/ViewIcon';
import TopicsPage from './components/pages/TopicsPage';


export const CustomComponents = [
  UserPage,
  OldPageHeader,
  OldPages,
  // SwitchTemplateLink,
  CreateUserPage,
  TopicsPage,
  // PdfView,
  Topic,
  Comments,
  TopicBlog,
  ResourceFields,
  ResourceContent,
  RichTextCustom,
  Youtube,
  ChatRooms,
  ChatRoom,
  JoinUserTechnologyButton,
  ViewIcon,
];


export class RootPage extends PrismaCmsComponent {

  render() {

    const {
      ...other
    } = this.props;

    return <RootConnector
      CustomComponents={CustomComponents}
      {...other}
    />
  }

}

export default RootPage;