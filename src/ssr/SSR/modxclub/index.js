


import chalk from "chalk";

import URI from 'urijs';

// import cheerio from "cheerio";

import SSR from "../";

var XMLWriter = require('xml-writer');


export class CustomSSR extends SSR {



  middleware = async (req, res) => {

    // console.log("process.env.NODE_ENV", process.env.PRISMA_CMS_TIMELOG);


    /**
     * Надо сбрасывать этот объект, чтобы не попадали результаты прошлого выполнения
     */
    global.document = undefined;

    const protocol = req.headers["server-protocol"] || req.protocol || "http";

    const host = req.get('host');

    const uri = new URI(`${protocol}://${host}${req.url}`);

    this.timeLogStart(uri.toString());

    const segment = uri.segment();


    let response;


    switch (segment[0]) {

      case "sitemap":

        response = await this.renderSitemap(req, res, uri)
          .catch(error => {
            console.error(chalk.red("Server error"), error);
            res.status(500);
            res.end(error.message);
            ;
          });

        break;

      default:
        response = await this.renderHTML(req, res, uri)
          .catch(error => {
            console.error(chalk.red("Server error"), error);
            res.status(500);
            res.end(error.message);
            ;
          });

    }

    this.timeLogEnd();

    return response;

  };


  /**
   * Рендеринк карты сайта.
   */

  async renderSitemap(req, res, uri) {

    const segment = uri.segment();

    /**
     * Убираем последний элемент
     */

    if (segment.length === 2 && segment[1] === 'index.xml') {
      return this.renderRootSitemap(req, res, uri);
    }
    else {

      const section = segment[1];

      switch (section) {


        case "main":

          return this.renderMainSitemap(req, res, uri);

        case "users":

          return this.renderUsersSitemap(req, res, uri);

        case "resources":

          return this.renderResourcesSitemap(req, res, uri);

        case "countries":

          return this.renderCountriesSitemap(req, res, uri);

        default:

          return res.status(404).send('Section not found');

      }
    }

  }


  renderRootSitemap(req, res, uri) {

    const cleanUri = uri.clone().query(null)

    /**
     * Выводим ссылки на разделы
     */
    const xml = new XMLWriter();

    xml.startDocument('1.0', 'UTF-8')

    xml.startElement("sitemapindex")
      .writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    ;


    /**
     * Формируем ссылки на разделы
     */
    const mainUri = cleanUri.clone();
    mainUri.directory(mainUri.directory() + '/main');

    const usersUri = cleanUri.clone();
    usersUri.directory(usersUri.directory() + '/users');

    const countriesUri = cleanUri.clone();
    countriesUri.directory(countriesUri.directory() + '/countries');

    // const resourcesUri = cleanUri.clone();
    // resourcesUri.directory(resourcesUri.directory() + '/resources');


    xml.startElement("sitemap")
      .writeElement("loc", mainUri.toString())
      .endElement();

    xml.startElement("sitemap")
      .writeElement("loc", usersUri.toString())
      .endElement();

    xml.startElement("sitemap")
      .writeElement("loc", countriesUri.toString())
      .endElement();

    // xml.startElement("sitemap")
    //   .writeElement("loc", resourcesUri.toString())
    //   .endElement();


    xml.endDocument();



    res.charset = 'utf-8';

    res.writeHead(200, {
      'Content-Type': 'application/xml',

    });

    res.end(xml.toString());

  }


  /**
   * Основные страницы
   */
  async renderMainSitemap(req, res, uri) {


    const xml = new XMLWriter();

    xml.startDocument('1.0', 'UTF-8')



    xml.startElement("urlset")
      .writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    ;



    this.addSitemapDocument(xml, uri, {
      url: `/`,
      priority: 1,
    })

    this.addSitemapDocument(xml, uri, {
      url: `/users/`,
      priority: 1,
    })

    this.addSitemapDocument(xml, uri, {
      url: `/countries/`,
      priority: 1,
    })


    xml.endDocument();



    res.charset = 'utf-8';

    res.writeHead(200, {
      'Content-Type': 'application/xml',

    });

    res.end(xml.toString());


    return;
  }

  /**
   * Пользователи
   */
  async renderUsersSitemap(req, res, uri) {

    const api = this.getApi();


    const segment = uri.segment();

    let page = segment[2];
    page = (page && isFinite(page)) ? parseInt(page) : undefined;

    let limit = 1000;


    const usersSchema = `
      {
        aggregate{
          count
        }
        edges{
          node{
            id
            updatedAt
          }
        }
      }
    `;

    let usersResult = await api.query.usersConnection({
      first: limit,
      skip: page > 1 ? (page - 1) * limit : undefined,
      where: {
        active: true,
        deleted: false,
      },
      orderBy: "updatedAt_DESC",
    }, usersSchema)
    // .catch(error => {
    //   res.status(500);
    //   res.end(error.message);
    //   ;
    // });

    const {
      aggregate: {
        count: total,
      },
      edges: usersEdges,
    } = usersResult;


    const users = usersEdges.map(({ node }) => node)

    /**
     * Плюсуем количество статических страниц
     */
    // let total = totalUsers;

    let pages = Math.ceil(total / limit);


    const xml = new XMLWriter();

    xml.startDocument('1.0', 'UTF-8')



    if (page) {

      xml.startElement("urlset")
        .writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
      ;


      users.map(user => {

        const {
          id,
          updatedAt,
        } = user;

        this.addSitemapDocument(xml, uri, {
          url: `/users/${id}/`,
          updatedAt,
          priority: 0.9,
        })

        return null;
      });

    }
    else {

      xml.startElement('sitemapindex')
        .writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

      let i = 0;

      while (pages > i) {
        i++;

        const pageUri = uri.clone().directory(`/sitemap/users/${i}/`);

        xml.startElement("sitemap")
          .writeElement("loc", pageUri.toString())
          .endElement();
      }

    }


    xml.endDocument();


    res.charset = 'utf-8';

    res.writeHead(200, {
      'Content-Type': 'application/xml',

    });

    res.end(xml.toString());


    return;

  }


  /**
   * Чат-комнаты
   */
  async renderChatRoomsSitemap(req, res, uri) {

    const api = this.getApi();

    const segment = uri.segment();

    let page = segment[2];
    page = (page && isFinite(page)) ? parseInt(page) : undefined;

    let limit = 1000;


    const schema = `
      {
        aggregate{
          count
        }
        edges{
          node{
            id
            updatedAt
          }
        }
      }
    `;

    let objectsResult = await api.query.chatRoomsConnection({
      first: limit,
      skip: page > 1 ? (page - 1) * limit : undefined,
      where: {
        // active: true,
        // deleted: false,
      },
      orderBy: "createdAt_DESC",
    }, schema)
    // .catch(error => {
    //   res.status(500);
    //   res.end(error.message);
    //   ;
    // });

    const {
      aggregate: {
        count: total,
      },
      edges,
    } = objectsResult;


    const objects = edges.map(({ node }) => node)


    let pages = Math.ceil(total / limit);


    const xml = new XMLWriter();

    xml.startDocument('1.0', 'UTF-8')


    if (page) {

      xml.startElement("urlset")
        .writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
      ;


      objects.map(user => {

        const {
          id,
          updatedAt,
        } = user;

        this.addSitemapDocument(xml, uri, {
          url: `/chat-rooms/${id}`,
          updatedAt,
          priority: 0.8,
        })

        return null;
      });

    }
    else {

      xml.startElement('sitemapindex')
        .writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

      let i = 0;

      while (pages > i) {
        i++;

        const pageUri = uri.clone().directory(`/sitemap/chat-rooms/${i}/`);

        xml.startElement("sitemap")
          .writeElement("loc", pageUri.toString())
          .endElement();
      }

    }


    xml.endDocument();


    res.charset = 'utf-8';

    res.writeHead(200, {
      'Content-Type': 'application/xml',

    });

    res.end(xml.toString());

    return;

  }

  /**
   * Ресурсы
   */
  async renderResourcesSitemap(req, res, uri) {

    const api = this.getApi();

    const segment = uri.segment();

    let page = segment[2];
    page = (page && isFinite(page)) ? parseInt(page) : undefined;

    let limit = 1000;


    const schema = `
      {
        aggregate{
          count
        }
        edges{
          node{
            id
            updatedAt
            uri
          }
        }
      }
    `;

    let objectsResult = await api.query.resourcesConnection({
      first: limit,
      skip: page > 1 ? (page - 1) * limit : undefined,
      where: {
        // active: true,
        // deleted: false,
        AND: [
          {
            uri_not: null,
          },
          {
            uri_gt: '',
          },
        ],
      },
      orderBy: "createdAt_DESC",
    }, schema)
    // .catch(error => {
    //   res.status(500);
    //   res.end(error.message);
    //   ;
    // });

    const {
      aggregate: {
        count: total,
      },
      edges,
    } = objectsResult;


    const objects = edges.map(({ node }) => node)


    let pages = Math.ceil(total / limit);


    const xml = new XMLWriter();

    xml.startDocument('1.0', 'UTF-8')


    if (page) {

      xml.startElement("urlset")
        .writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
      ;


      objects.map(object => {

        const {
          // id,
          updatedAt,
          uri: resourceUri,
        } = object;

        this.addSitemapDocument(xml, uri, {
          url: resourceUri,
          updatedAt,
          priority: 0.9,
        })

        return null;
      });

    }
    else {

      xml.startElement('sitemapindex')
        .writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

      let i = 0;

      while (pages > i) {
        i++;

        const pageUri = uri.clone().directory(`/sitemap/resources/${i}/`);

        xml.startElement("sitemap")
          .writeElement("loc", pageUri.toString())
          .endElement();
      }

    }


    xml.endDocument();


    res.charset = 'utf-8';

    res.writeHead(200, {
      'Content-Type': 'application/xml',

    });

    res.end(xml.toString());

    return;

  }

  /**
   * Страны
   */
  async renderCountriesSitemap(req, res, uri) {

    const api = this.getApi();

    const segment = uri.segment();

    let page = segment[2];
    page = (page && isFinite(page)) ? parseInt(page) : undefined;

    let limit = 1000;


    const schema = `
      {
        aggregate{
          count
        }
        edges{
          node{
            id
            updatedAt
          }
        }
      }
    `;

    let objectsResult = await api.query.countriesConnection({
      first: limit,
      skip: page > 1 ? (page - 1) * limit : undefined,
      where: {
        // active: true,
        // deleted: false,
      },
      orderBy: "createdAt_DESC",
    }, schema)
    // .catch(error => {
    //   res.status(500);
    //   res.end(error.message);
    //   ;
    // });

    const {
      aggregate: {
        count: total,
      },
      edges,
    } = objectsResult;


    const objects = edges.map(({ node }) => node)


    let pages = Math.ceil(total / limit);


    const xml = new XMLWriter();

    xml.startDocument('1.0', 'UTF-8')


    if (page) {

      xml.startElement("urlset")
        .writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
      ;


      objects.map(object => {

        const {
          id,
          updatedAt,
        } = object;

        this.addSitemapDocument(xml, uri, {
          url: `/countries/${id}/`,
          updatedAt,
          priority: 0.9,
        })

        return null;
      });

    }
    else {

      xml.startElement('sitemapindex')
        .writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

      let i = 0;

      while (pages > i) {
        i++;

        const pageUri = uri.clone().directory(`/sitemap/countries/${i}/`);

        xml.startElement("sitemap")
          .writeElement("loc", pageUri.toString())
          .endElement();
      }

    }


    xml.endDocument();


    res.charset = 'utf-8';

    res.writeHead(200, {
      'Content-Type': 'application/xml',

    });

    res.end(xml.toString());


    return;

  }


}


module.exports = CustomSSR;
