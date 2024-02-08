//-----------------------------------------
//------------------GRAPHQL----------------
//-----------------------------------------

import { buildSchema } from "type-graphql";

//-----------------------------------------
//-----------------RESOLVERS---------------
//-----------------------------------------

import { UsersResolver } from "./resolvers/Users";
import { customAuthChecker } from "./auth";
import { PictureResolver } from "./resolvers/Pictures";

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [UsersResolver, PictureResolver],
    authChecker: customAuthChecker,
  });
  return schema;
}
