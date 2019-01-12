
import React, {
  Component,
} from 'react';


import Context from '@prisma-cms/context';

import * as UI from "@modxclub/ui"

class ContextProvider extends Component {

  static contextType = Context;


  render() {

    const {
      children,
    } = this.props;

    let {
      query,
    } = this.context;

    Object.assign(this.context, {
      query: {
        ...query,
        ...this.prepareQuery(),
      },
      ...UI,
    });

    return <Context.Provider
      value={this.context}
    >
      {children || null}
    </Context.Provider>;

  }


  prepareQuery() {


    return {
      ...this.prepareResourcesQuery(),
    }

  }


  prepareResourcesQuery() {

    const {
      queryFragments: {
        ResourceNoNestingFragment,
        UserNoNestingFragment,
      },
    } = this.context;


    const blogFragment = `
      fragment blog on Resource{
        ...ResourceNoNesting
        CreatedBy{
          ...UserNoNesting
        }
      }
      ${ResourceNoNestingFragment}
      ${UserNoNestingFragment}
    `;

    const createBlogProcessor = `
      mutation createBlogProcessor(
        $data: BlogCreateInput!
      ){
        response: createBlogProcessor(
          data: $data
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...blog
          }
        }
      }

      ${blogFragment}
    `;

    const updateBlogProcessor = `
      mutation updateBlogProcessor(
        $data: BlogUpdateInput!
        $where: ResourceWhereUniqueInput!
      ){
        response: updateBlogProcessor(
          data: $data
          where: $where
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...blog
          }
        }
      }

      ${blogFragment}
    `;
 

    return {
      createBlogProcessor,
      updateBlogProcessor,
    }
  }

}

export default ContextProvider;