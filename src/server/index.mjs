
import startServer from "@prisma-cms/server";
import CoreModule from "./modules";


const coreModule = new CoreModule({
});

const resolvers = coreModule.getResolvers();

// console.log("resolvers", resolvers.Mutation);

startServer({
  typeDefs: 'src/schema/generated/api.graphql',
  resolvers,
  MailerProps: {
    mailSender: "no-reply@modxclub.ru",
  },
});


