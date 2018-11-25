
import React, { Fragment } from "react";

import CooperationTasksPage from "@prisma-cms/cooperation/lib/components/pages/Tasks";

import Page from "../layout";

export class TasksPage extends Page {


  render() {

    return <Fragment>

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
        {...this.props}
      />
    </Fragment>;
  }

}

export default TasksPage;