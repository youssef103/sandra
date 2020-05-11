const { ApolloServer, gql } = require("apollo-server");

const users = [
  { id: "1", name: "name1", email: "email1@gmail.com", authorId: "2" },
  { id: "2", name: "name2", email: "email2@gmail.com", authorId: "2" },
  { id: "3", name: "name3", email: "email3@gmail.com", authorId: "1" },
];

const authors = [
  { id: "1", name: "Author1", age: 25 },
  { id: "2", name: "Author2", age: 30 },
  { id: "3", name: "Author3", age: 80 },
];

const typeDefs = gql`
  type User {
    id: ID
    name: String
    email: String
    author: [Author]
  }

  type Author {
    id: ID
    name: String
    age: Int
  }

  type Query {
    users: [User]
    user(id: ID!): User
    authors: [Author]
  }
`;

const resolvers = {
  Query: {
    users: () => {
      return users;
    },
    user: (obj, args, context, info) => {
      return users.find((user) => user.id === args.id);
    },
    authors: () => {
      return authors;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
