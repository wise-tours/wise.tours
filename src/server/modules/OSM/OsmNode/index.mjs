
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";

// var parseString = require('xml2js').parseString;
// import xml2js from 'xml2js';

import xmljs from 'xml-js';

// console.log('xmljs', xmljs);

export class OsmNodeProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "OsmNode";
  }


  async create(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.create(method, args, info);
  }


  async update(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.update(method, args, info);
  }


  async mutate(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.mutate(method, args);
  }



  async delete(method, args, info) {

    return super.delete(method, args);
  }


  /**
   * Импортируем страны
   */
  async importCountries(args, info) {

    const query = `node["place"="country"];out;`;

    const data = await this.getData(query);

    const {
      node: nodes,
    } = data;


    /**
     * Обрабатываем каждую запись
     */
    const queue = this.upsertCountries(nodes, info);

    const result = [];

    for await (const q of queue) {
      // console.log(chalk.green("updateOrCreateVideoRooms result"), result);
      if (q) {
        result.push(q);
      }
    }

    return result;
  }


  async * upsertCountries(objects, info) {

    // console.log(chalk.green("updateOrCreateVideoRooms"));

    const {
      API_SUDO_USER_USERNAME,
    } = process.env;

    const {
      db,
    } = this.ctx;

    while (objects && objects.length) {

      const object = objects.shift();

      // console.log('upsertCountries object', object);

      let {
        _attributes: {
          id: externalKey,
          lat,
          lon,
        },
        tag,
      } = object;

      externalKey = parseFloat(externalKey);
      lat = parseFloat(lat);
      lon = parseFloat(lon);

      if (!externalKey) {
        throw new Error('externalKey is empty');
      }

      if (isNaN(lat)) {
        throw new Error('lat is empty');
      }

      if (isNaN(lon)) {
        throw new Error('lon is empty');
      }


      const tags = {};

      if (tag && tag.length) {
        tag.map(({ _attributes: { k, v } }) => {
          tags[k] = v;
          return null;
        });
      }

      // console.log('upsertCountries tags', tags);

      /**
       * Получаем уже имеющуюся запись страны
       */

      const [country] = await db.query.countries({
        where: {
          OsmNode: {
            externalKey,
          },
        },
      });

      // console.log('country', JSON.stringify(country, true, 2));

      let {
        'ISO3166-1': ISO3166_1,
        name: defaultName,
        'name:ru': name_ru,
        'name:en': name_en,

        /**
         * Тип объекта, например country
         */
        place,

        /**
         * Численность населения
         */
        population,

        /**
         * Прощадь в километрах
         */
        sqkm,
      } = tags;

      population = population ? parseFloat(population.replace(/ /g, '')) : null;
      sqkm = sqkm ? parseFloat(sqkm.replace(/ /g, '')) : null;

      const name = name_ru || name_en || defaultName;

      if (!name) {
        throw new Error('name is empty');
      }

      const data = {
        lat,
        lon,
        ISO3166_1,
        name,
        place,
      }

      const countryData = {
        population,
        sqkm,
        lat,
        lon,
      }
      
      const countryCreateData = {
        ...countryData,
        /**
         * Название объекта не обновляем, а только создаем,
         * чтобы можно было на конечном сайте подправить.
         */
        name,
        id: country ? country.id : undefined,
        Type: {
          connect: {
            code: "country",
          },
        },
        CreatedBy: {
          connect: {
            username: API_SUDO_USER_USERNAME,
          },
        },
      };
      const countryUpdateData = {
        ...countryData,
      };

      const result = await db.mutation.upsertOsmNode({
        where: {
          externalKey,
        },
        create: {
          ...data,
          externalKey,
          GeoObject: {
            create: countryCreateData,
          },
        },
        update: {
          ...data,
          GeoObject: {
            upsert: {
              create: countryCreateData,
              update: countryUpdateData,
            },
          },
        },
      }, info)
      // .catch(console.error);


      yield result;

      // break;
    }

  }


  async getData(query) {

    return fetch(`https://overpass-api.de/api/interpreter?data=${query}`)
      .then(response => response.text())
      .then(xml => {

        const result = xmljs.xml2js(xml, {
          compact: true,
          ignoreComment: true,
          alwaysChildren: true,
          // nativeType: true,
          // nativeTypeAttributes: true,
        });

        const {
          osm,
        } = result || {};

        if (!osm) {
          throw new Error('Can not get OSM data');
        }

        return osm;
      })
  }
}


export default class OsmNodeModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return OsmNodeProcessor;
  }


  getResolvers() {

    const {
      Query: {
        ...Query
      },
      Subscription: {
        ...Subscription
      },
      Mutation: {
        ...Mutation
      },
      ...other
    } = super.getResolvers();

    return {
      ...other,
      Query: {
        ...Query,
        osmNode: (source, args, ctx, info) => {
          return ctx.db.query.osmNode(args, info);
        },
        osmNodes: (source, args, ctx, info) => {
          return ctx.db.query.osmNodes(args, info);
        },
        osmNodesConnection: (source, args, ctx, info) => {
          return ctx.db.query.osmNodesConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        createOsmNodeProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).createWithResponse("OsmNode", args, info);
        },
        updateOsmNodeProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("OsmNode", args, info);
        },
        deleteOsmNode: (source, args, ctx, info) => {
          return this.getProcessor(ctx).delete("OsmNode", args, info);
        },
        importCountries: (source, args, ctx, info) => {
          return this.getProcessor(ctx).importCountries(args, info);
        },
      },
      Subscription: {
        ...Subscription,
        osmNode: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.osmNode({}, info);
          },
        },
      },
      OsmNodeResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.osmNode({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}