import db from "./graphql/db";
const { GraphQLServer } = require("graphql-yoga");
const Query = require("./graphql/resolvers/Query");
const Mutation = require("./graphql/resolvers/Mutation");

// Server
const server = new GraphQLServer({
  typeDefs: `${__dirname}/graphql/schema.graphql`,
  resolvers: {
    Query,
    Mutation,
  },
  context: {
    db,
  },
});

server.start().then(() => console.log(`Server is up`));
