import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import PrismaCmsComponent from "@prisma-cms/component";
import RootConnector, { FrontEditorRoot } from '@prisma-cms/front-editor/lib/components/Root';
import UserPage from './components/pages/Users/User';
import OldPageHeader from './components/OldPageHeader';
import OldPages from './components/pages/OldPages';
import SwitchTemplateLink from './components/Link/SwitchTemplate';
import PdfView from './components/PdfView';
import CreateUserPage from './components/pages/Users/User/Create';

import URI from "urijs";

import { Link } from "react-router-dom";
import Topic from './components/Resource/Topic';
import ResourceFields from './components/Resource/Fields';
import ResourceContent from './components/Resource/Fields/Field/ResourceContent';
import Comments from './components/Resource/Comments';
import TopicBlog from './components/Resource/Topic/TopicBlog';

class RootPage extends PrismaCmsComponent {


  componentWillMount() {

    this.initLocales({
      ru: {
        values: {
          "Reset template": "Сбросить шаблон",
        },
      },
    });

    this.initTemplate();

    super.componentWillMount && super.componentWillMount();
  }


  initTemplate() {

    const {
      location: {
        pathname: newPathname,
        search: newSearch,
      },
    } = this.props;

    const uri = new URI(`${newPathname}${newSearch}`);

    const {
      templateId,
    } = uri.query(true);


    if (templateId !== undefined) {

      const {
        localStorage,
      } = global;

      if (localStorage && localStorage.setItem) {
        localStorage.setItem("PrismaCmsTemplateId", templateId);
      }

    }

  }


  componentWillReceiveProps(props, state) {




    const {
      location: {
        pathname: newPathname,
        search: newSearch,
      },
    } = props;

    const {
      location: {
        pathname,
        search,
      },
    } = this.props;

    const uri = new URI(`${newPathname}${newSearch}`);

    const oldUri = new URI(`${pathname}${search}`);

    const {
      templateId,
    } = uri.query(true);

    const {
      templateId: oldTemplateUrl,
    } = oldUri.query(true);

    if (templateId !== undefined && templateId !== oldTemplateUrl) {

      const {
        localStorage,
      } = global;

      if (localStorage && localStorage.setItem) {
        localStorage.setItem("PrismaCmsTemplateId", templateId);
      }

    }

    super.componentWillReceiveProps && super.componentWillReceiveProps();

  }


  render() {

    const {
      CustomComponents = [],
      ...other
    } = this.props;

    const {
      PrismaCmsTemplateId,
    } = global.localStorage || {};

    let props = {

    }


    if (PrismaCmsTemplateId) {

      let where;

      where = {
        id: PrismaCmsTemplateId,
      }

      Object.assign(props, {
        where,
      });

    }


    let content = null;


    content = <RootConnector
      CustomComponents={CustomComponents.concat([
        UserPage,
        OldPageHeader,
        OldPages,
        SwitchTemplateLink,
        CreateUserPage,
        PdfView,
        Topic,
        ResourceFields,
        ResourceContent,
        Comments,
        TopicBlog,
      ])}
      // where={where}
      {...props}
      {...other}
    // _dirty={{
    //   name: "Page",
    //   components: [],
    //   props: {},
    //   Parent: {
    //     connect: {
    //       id: "cjug5g5ws01fp0917yyi6xe65",
    //     },
    //   },
    // }}
    />

    return <Fragment>
      {PrismaCmsTemplateId ? <div>
        <Link
          to="/?templateId="
        >
          {this.lexicon("Reset template")}
        </Link>
      </div> : null}

      {content}
    </Fragment>
  }

}

export default RootPage;