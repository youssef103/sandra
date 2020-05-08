const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
} = graphql;

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

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    author: {
      type: AuthorType,
      resolve: (parent, args) => {
        return authors.find((author) => author.id === parent.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: (parent, args) => {
        return users.filter((user) => user.authorId === parent.id);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return users.find((user) => user.id === args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return authors.find((author) => author.id === args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
