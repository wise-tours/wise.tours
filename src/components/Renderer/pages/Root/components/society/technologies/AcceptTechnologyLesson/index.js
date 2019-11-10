import React from 'react';

import EditorComponent from '@prisma-cms/front-editor/lib/components/App/components/';
import { ObjectContext } from '@prisma-cms/front-editor/lib/components/App/components/public/Connectors/Connector/ListView';
import Button from 'material-ui/Button';
import gql from 'graphql-tag';

export class AcceptTechnologyLesson extends EditorComponent {

  static Name = 'AcceptTechnologyLesson';

  static defaultProps = {
    ...EditorComponent.defaultProps,
  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        AcceptTechnologyLesson
      </div>
    );
  }


  getRootElement() {

    return super.getRootElement();
  }


  canBeParent(parent) {

    return super.canBeParent(parent);
  }


  canBeChild(child) {

    return super.canBeChild(child);
  }


  renderChildren() {

    const {
      user: currentUser,
    } = this.context;

    // const {
    // } = this.getEditorContext();

    // const {
    //   ...other
    // } = this.getComponentProps(this);


    const {
      loading,
    } = this.state;


    const query = `
      mutation create (
        $data: TechnologyLessonUserCreateInput!
      ){
        response: createTechnologyLessonUserProcessor (
          data: $data
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...lessonUser
            CreatedBy {
              ...user
            }
          }
        }
      }
      
      fragment lessonUser on TechnologyLessonUser @prismaCmsFragmentAllFields {
        id
      }
      
      fragment user on User @prismaCmsFragmentAllFields {
        id
      }
    `;


    // const children = super.renderChildren();

    const {
      id: currentUserId,
    } = currentUser || {};

    return <ObjectContext.Consumer
      key="AcceptTechnologyLesson"
    >

      {objectContext => {

        const {
          object,
        } = objectContext;

        const {
          id: lessonId,
          Users,
          __typename,
        } = object || {};


        if (!lessonId) {
          return null;
        }


        if (__typename !== "TechnologyLesson") {

          console.error("__typename !== TechnologyLesson");

          return null;
        }


        const accepted = currentUserId && Users && Users.findIndex(n => n && n.CreatedBy && n.CreatedBy.id === currentUserId) !== -1 ? true : false;

        // return children;

        let output = null;

        if (!accepted) {

          output = <Button
            variant="raised"
            size="small"
            disabled={loading ? true : false}
            onClick={event => {

              this.mutate({
                mutation: gql(query),
                variables: {
                  data: {
                    Lesson: {
                      connect: {
                        id: lessonId,
                      },
                    },
                  },
                },
              });
            }}
          >
            Принять
          </Button>

        }

        return output;

      }}

    </ObjectContext.Consumer>
  }

}

export default AcceptTechnologyLesson;