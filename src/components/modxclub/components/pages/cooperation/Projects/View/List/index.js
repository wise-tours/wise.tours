import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { graphql } from 'react-apollo';

import {
  // createProjectProcessor,
  updateProjectProcessor,
} from "../../query";

import Project from "../Project";

import {
  Grid,
} from "@modxclub/ui";

// const NewProject = graphql(createProjectProcessor)(Project);
const UpdateProject = graphql(updateProjectProcessor)(Project);

class ProjectsList extends Component {

  static propTypes = {
    projects: PropTypes.array.isRequired,
  };

  static defaultProps = {
  };

  render() {

    const {
      projects,
    } = this.props;

    return <Grid
      container
      spacing={16}
    >

      {projects.map(n => {
        const {
          id,
        } = n;

        return <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <UpdateProject
            key={id}
            data={{
              object: n,
            }}
          />
        </Grid>
      })}

    </Grid>
  }
}


export default ProjectsList;