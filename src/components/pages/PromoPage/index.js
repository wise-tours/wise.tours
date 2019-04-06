import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";

import { Button } from 'material-ui';
import { withStyles } from 'material-ui';

// import { FrontEditor } from "@prisma-cms/front";
import FrontEditor from "@prisma-cms/front/lib/components/FrontEditor";
import TopicsConnection from './Topics';
import TopicLink from './Topics/TopicLink';

export const styles = {
  root: {
    "&.inEditMode": {
      height: "100%",
      display: "flex",
      flexDirection: "column",

      "& $editorWrapper": {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        // border: "1px solid red",
        overflow: "auto",
      },
    },
  },
  editorWrapper: {
  },
}

class FrontEditorPage extends Component {

  static contextType = Context;

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    inEditMode: true,
    components: [
      {
        "type": "Page",
        "components": [
          {
            "type": "Section",
            "components": [
              {
                "type": "Grid",
                "container": true,
                "components": [
                  {
                    "type": "Grid",
                    "xs": 12,
                    "item": true,
                    "components": [
                      {
                        "type": "Typography",
                        "variant": "title",
                        "text": "Здесь всем можно редактировать",
                        "color": "secondary"
                      }
                    ]
                  },
                  {
                    "type": "Grid",
                    "xs": 12,
                    "item": true,
                    "components": [
                      {
                        "type": "Typography",
                        "text": "Пока поиграйтесь (с телефона неудобно), а вечером я напишу статью",
                        "variant": "subheading",
                        "color": "primary"
                      }
                    ]
                  }
                ]
              },
            ],

          },
          {
            "type": "Section",
            "components": [
              {
                "type": "TopicsConnection",
                "first": 4,
                "components": [
                  {
                    "type": "Typography",
                    "text": "Последние топики",
                    "displayType": "div",
                    "display": "block",
                    "variant": "subheading",
                    "color": "primary"
                  },
                  {
                    "type": "Filters",
                  },
                  {
                    "type": "ListView",
                    "components": [
                      {
                        "type": "Grid",
                        "item": true,
                        "xs": 12,
                        "components": [
                          {
                            "type": "Section",
                            "components": [
                              {
                                "type": "Grid",
                                "container": true,
                                "alignItems": "center",
                                "spacing": 8,
                                "components": [
                                  {
                                    "type": "Grid",
                                    "item": true,
                                    "xs": 12,
                                    "md": 3,
                                    "components": [
                                      {
                                        "type": "Typography",
                                        "text": "Название:",
                                        "variant": "caption"
                                      }
                                    ]
                                  },
                                  {
                                    "type": "Grid",
                                    "xs": true,
                                    "item": true,
                                    "components": [
                                      {
                                        "type": "TopicLink"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "type": "Grid",
                                "container": true,
                                "alignItems": "center",
                                "spacing": 8,
                                "components": [
                                  {
                                    "type": "Grid",
                                    "item": true,
                                    "xs": 12,
                                    "md": 3,
                                    "components": [
                                      {
                                        "type": "Typography",
                                        "text": "Дата создания:",
                                        "variant": "caption"
                                      }
                                    ]
                                  },
                                  {
                                    "type": "Grid",
                                    "xs": true,
                                    "item": true,
                                    "components": [
                                      {
                                        "type": "NamedField",
                                        "name": "createdAt"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "type": "Grid",
                                "container": true,
                                "alignItems": "center",
                                "spacing": 8,
                                "components": [
                                  {
                                    "type": "Grid",
                                    "item": true,
                                    "xs": 12,
                                    "md": 3,
                                    "components": [
                                      {
                                        "type": "Typography",
                                        "text": "Кем написан:",
                                        "variant": "caption"
                                      }
                                    ]
                                  },
                                  {
                                    "type": "Grid",
                                    "xs": true,
                                    "item": true,
                                    "components": [
                                      {
                                        "type": "CreatedBy"
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "Pagination"
                  }
                ],
                "query": "resourcesConnection",
                "where": {
                  "type": "Topic"
                },
                "orderBy": "createdAt_DESC",
                "pagevariable": "topicsPage",
                "filtersname": "topicsFilters"
              }
            ]
          },
          {
            "type": "Section",
            "components": [
              {
                "type": "Typography",
                "text": "Все пользователи",
                "displayType": "div",
                "display": "block",
                "variant": "subheading",
                "color": "primary"
              },
              {
                "type": "UsersGrid",
                "first": 10
              }
            ]
          }
        ]
      }
    ],
  }

  render() {

    const {
      // FrontEditor,
      Grid,
    } = this.context;

    const {
      components,
      inEditMode,
    } = this.state;

    const {
      classes,
    } = this.props;

    let toolbar = <Grid
      container
      spacing={8}
    >
      <Grid
        item
      >
        <Button
          onClick={event => this.setState({
            inEditMode: !inEditMode,
          })}
          size="small"
          color={inEditMode ? "secondary" : "primary"}
        >
          {inEditMode ? "Завершить редактирование" : "Начать редактирование"}
        </Button>
      </Grid>
    </Grid>

    // console.log("FrontEditor", FrontEditor, this.context);

    // return "SDfsdf";

    return (
      <div
        className={[classes.root, inEditMode ? "inEditMode" : ""].join(" ")}
      >

        {toolbar}

        <div
          className={classes.editorWrapper}
        >
          <FrontEditor
            inEditMode={inEditMode}
            components={components}
            onChange={components => {

              this.setState({
                components,
              })
            }}
            CustomComponents={[
              TopicsConnection,
              TopicLink,
            ]}
            debug={true}
          />
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(props => <FrontEditorPage
  {...props}
/>);