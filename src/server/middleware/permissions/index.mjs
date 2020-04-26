
import GraphQLShield from 'graphql-shield';

const {
  rule,
  // and,
  // or,
  shield,
} = GraphQLShield;

const rules = {
  isSudo: rule({ cache: 'no_cache' })((source, args, ctx) => {

    // console.log('isSudo source', JSON.stringify(source));
    // console.log('isSudo args', JSON.stringify(args));

    const {
      currentUser,
    } = ctx;

    const {
      sudo,
    } = currentUser || {};

    return sudo === true;
  }),
};

export default shield(
  {
    Mutation: {
      createBlogProcessor: rules.isSudo,
      updateBlogProcessor: rules.isSudo,
      // deleteBlog: rules.isSudo,

      createOsmNodeProcessor: rules.isSudo,
      updateOsmNodeProcessor: rules.isSudo,
      deleteOsmNode: rules.isSudo,
      importCountries: rules.isSudo,

      createCountryProcessor: rules.isSudo,
      updateCountryProcessor: rules.isSudo,
      deleteCountry: rules.isSudo,

      exportTemplates: rules.isSudo,

      createGeoObjectTypeProcessor: rules.isSudo,
      updateGeoObjectTypeProcessor: rules.isSudo,
      deleteGeoObjectType: rules.isSudo,

      createGeoObjectProcessor: rules.isSudo,
      updateGeoObjectProcessor: rules.isSudo,
      deleteGeoObject: rules.isSudo,
    },
  },
  {
    fallbackError: (error, parent, args, context, info) => {

      // console.log('fallbackError error', error);
      // console.log('fallbackError parent', parent);

      return error || new Error("Доступ запрещен");
    },
  }
);

