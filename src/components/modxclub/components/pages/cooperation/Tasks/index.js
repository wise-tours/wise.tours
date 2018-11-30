
import React, { Fragment } from "react";
import PropTypes from 'prop-types';

import CooperationTasksPage from "@prisma-cms/cooperation/lib/components/pages/Tasks";

import Page from "../../layout";
import View from "./View/Gantt";


import {
  TasksConnector,
} from "./query";


export class TasksPage extends Page {

  static propTypes = {
    ...Page.propTypes,
    // first: PropTypes.number.isRequired,
    // orderBy: PropTypes.string.isRequired,
  };


  static defaultProps = {
    ...Page.defaultProps,
    // first: 1000,
    // orderBy: "createdAt_ASC",
    View,
  }



  // setPageMeta(meta = {}) {

  //   return super.setPageMeta({
  //     title: "Задачи",
  //     ...meta,
  //   });

  // }


  render() {


    let {
      // first,
      // where,
      ...other
    } = this.props;

    // const {
    //   uri,
    // } = this.context;


    // let {
    //   page,
    // } = uri.query(true);



    // let skip;

    // page = page && parseInt(page) || 0;

    // if (first && page > 1) {
    //   skip = (page - 1) * first;
    // }

    return (<Fragment>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            #root {
              display: flex;
              flex-direction: column;
            }
          `,
        }}
      />

      <CooperationTasksPage
        TasksConnector={TasksConnector}
        // where={where}
        // first={first}
        // skip={skip}
        // page={page ? parseInt(page) : undefined}
        {...other}
      />

    </Fragment>);
  }

}

export default TasksPage;