const { GraphQLServer } = require("graphql-yoga");
const uuid = require("uuid").v4;

// Type definitions (schema)
const typeDefs = `
    type Query {
        users: [User!]!
        me: User!
        post: Post!,
        posts(query: String): [Post!],
        comments: [Comment!]
    },

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!,
        createPost(title: String!, body: String!, published: Boolean!, name: String!): Post!
    },
        
    type User {
        id: ID!,
        name: String!,
        age: Int,
        occupation: String!,
        email: String!,
        posts: [Post!],
        comments: [Comment!]
    },

    type Post {
        title: String!,
        body: String,
        author: User!,
        published: Boolean,
        id: ID!,
        comments: [Comment!]
    },

    type Comment {
        id: ID!,
        text: String!,
        author: User!,
        post: [Post!]
    }
`;

const resolvers = {
  Query: {
    users: (parent, args, ctx, info) => {
      return users;
    },
    posts: (parent, args, ctx, info) => {
      return posts;
    },
    comments: (parent, args, ctx, info) => {
      return comments;
    },
  },
  Mutation: {},
};

/// Data
let comments = [
  {
    id: 12345,
    text: "It does indeed take great skill thanks blue bottle",
    author: "blue bottle",
    post: 123,
  },
  {
    id: 1234,
    text:
      "Aeropress is simply the best thanks Stumptown you guys are kind of hipster dummies",
    author: "Stumptown",
    post: 666,
  },
  {
    id: 123,
    text:
      "Not bad, mostly use while camping cause it's so easy thanks Coffee guy",
    author: "Coffee guy",
    post: 6666,
  },
];

let posts = [
  {
    title: "how to brew hario V60",
    body: "with great skill",
    author: "blue bottle",
    published: false,
    id: 123,
  },
  {
    title: "how to brew aeropress",
    body:
      "arguable the best brew you'll  find however not everyone will agree with this",
    author: "Stumptown",
    published: true,
    id: 666,
  },
  {
    title: "how to brew french press",
    body: "Not too complicated. gives some of that good ole sludge",
    author: "Coffee guy",
    published: true,
    id: 6666,
  },
];

let users = [
  {
    id: 123,
    name: "Coffee guy",
    age: 45,
    occupation: "Software",
  },
  {
    id: 1234,
    name: "Stumptown",
    age: 17,
    occupation: "coffee shop",
  },
  {
    id: 12345,
    name: "blue bottle",
    occupation: "coffee producers",
  },
];

// Server
const options = {
  port: process.env.PORT || 6000,
  /* endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground",*/
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start().then(() => console.log(`Server is up`));
