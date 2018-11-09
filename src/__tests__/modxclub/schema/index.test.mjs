
import expect from 'expect'

import chalk from "chalk";

import {
  verifySchema,
} from "../../server/default/schema.test.mjs";

import TestModule from "../../../server/modules";


import mocha from 'mocha'
const { describe, it } = mocha

const module = new TestModule();


/**
 */

const requiredTypes = [
  {
    name: "Query",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "Route",
    fields: {
      both: [
        "id",
      ],
      prisma: [
      ],
      api: [
      ],
    },
  },
  {
    name: "User",
    fields: {
      both: [
        "createdAt",
        "Votes",
        "NotificationTypes",
      ],
      prisma: [
      ],
      api: [
        "Companies",
        "Services",
        "Projects",
      ],
    },
  },
  {
    name: "Company",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "name",
        "uri",
        "resource_id",
        "Resource",
        "createdAt",
        "createdby",
        "CreatedBy",
        "owner",
        "Owner",
      ],
    },
  },
  {
    name: "Service",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "name",
        "uri",
        "Users",
      ],
    },
  },
  {
    name: "UserNotice",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "user_id",
        "notice_id",
        "active",
        "User",
        "Notice",
      ],
    },
  },
  {
    name: "Notice",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "name",
        "comment",
        "rank",
        "UsersNotices",
      ],
    },
  },
  {
    name: "Project",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "name",
        "uri",
        "site_url",
        "Members",
      ],
    },
  },
  {
    name: "ProjectMember",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "status",
        "project_id",
        "Project",
        "user_id",
        "User",
        "service_id",
        "Service",
      ],
    },
  },
  {
    name: "Resource",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "name",
        "longtitle",
        "content",
        "alias",
        "published",
        "deleted",
        "hidemenu",
        "searchable",
        "class_key",
        "context_key",
        "uri",
        "uri_override",
        "createdby",
        "template",
        "publishedon",
        "createdon",
        "editedon",
        "CreatedBy",
      ],
    },
  },
  {
    name: "Blog",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "name",
        "longtitle",
        "content",
        "alias",
        "published",
        "deleted",
        "hidemenu",
        "searchable",
        "class_key",
        "context_key",
        "uri",
        "uri_override",
        "createdby",
        "template",
        "publishedon",
        "createdAt",
        "updatedAt",
        "CreatedBy",
        "personal",
        "Topics",
      ],
    },
  },
  {
    name: "Topic",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "name",
        "name",
        "longtitle",
        "content",
        "createdAt",
        "updatedAt",
        "alias",
        "published",
        "deleted",
        "hidemenu",
        "searchable",
        "class_key",
        "context_key",
        "uri",
        "uri_override",
        "createdby",
        "template",
        "publishedon",
        "CreatedBy",
        "Tags",
        "blog_id",
        "Blog",
        "Comments",
        "thread_id",
        "Thread",
      ],
    },
  },
  {
    name: "Tag",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "name",
        "count",
        "topic_ids",
      ],
    },
  },
  {
    name: "TopicTag",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "name",
        "topic_id",
        "Topic",
      ],
    },
  },
  {
    name: "Comment",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "createdAt",
        "updatedAt",
        "text",
        "createdby",
        "Author",
        "parent",
        "Parent",
        "deleted",
        "published",
        "comments_count",
        "thread_id",
        "Thread",
        "topic_id",
        "Topic",
        "Childs",
        "CreatedBy",
      ],
    },
  },
  {
    name: "Thread",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "target_id",
        "target_class",
        "comments_count",
        "createdAt",
        "updatedAt",
        "rating",
        "positive_votes",
        "negative_votes",
        "neutral_votes",
        "Comments",
      ],
    },
  },
  {
    name: "Vote",
    fields: {
      both: [
      ],
      prisma: [
      ],
      api: [
        "id",
        "target_id",
        "target_class",
        "thread_id",
        "Thread",
        "user_id",
        "direction",
        "value",
        "createdAt",
        "Target",
      ],
    },
  },
]




describe('modxclub Verify prisma Schema', () => {

  verifySchema(module.getSchema(), requiredTypes);

});


describe('modxclub Verify API Schema', () => {

  verifySchema(module.getApiSchema(), requiredTypes);

});