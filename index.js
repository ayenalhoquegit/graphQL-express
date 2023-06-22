const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const graphql = require("graphql");
const mockData = require("./MOCK_DATA.json");
const app = express();
const PORT = 6969;

// Maps id to User object
const fakeData = [
  {
    id: 1,
    name: "alice",
  },
  {
    id: 2,
    name: "bob",
  },
];

// Define the user type
const userType = new graphql.GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
  },
});
// Define the Query type
const queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    findUserById: {
      type: userType,
      args: { id: { type: graphql.GraphQLInt } },
      resolve: (parent,{ id }) => {
        return fakeData.find((u) => u.id === id);
      },
    },
    findAll: {
      type: graphql.GraphQLList(userType),
      args:{ id: { type: graphql.GraphQLInt }},
      resolve: () => {
        return fakeData;
      },
    },
  },
});

const mutation = new graphql.GraphQLObjectType({
 name:"Mutation",
 fields:{
   createUser:{
    type:userType,
    args:{
      name:{type:graphql.GraphQLString}
    },
    resolve:(parent,arg)=>{
      fakeData.push({id:fakeData.length+1, name:arg.name})
      return arg;
    }
   }
 }
});

const schema = new graphql.GraphQLSchema({ query: queryType,mutation:mutation })

// const schema = buildSchema(`
// type User {
//   id: Int
//   name: String
// }
//     type Query{
//       findUserById(id: Int):User
//       findAll():[User]
//     }
// `);

// const root = {
//   findUserById: ({ id }) => {
//     return fakeData.find((u) => u.id === id);
//   },
//   findAll: () => fakeData,
// };

app.use(
  "/graphql",
  graphqlHTTP({ schema: schema, graphiql: true })
);

app.listen(PORT, () => {
  console.log("Server running");
});
