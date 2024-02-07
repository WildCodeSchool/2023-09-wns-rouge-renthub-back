import { config } from "dotenv";
config();
import { describe, it, expect, beforeAll, jest } from "@jest/globals";
import { getSchema } from "../../src/schema";
import { GraphQLSchema, graphql, print } from "graphql";
import { DataSource } from "typeorm";
import { dataSourceOptions } from "../../src/datasource";
import { mutationUserCreate } from "./graphql/mutationUserCreate";
import { mutationUserLogin } from "./graphql/mutationUserLogin";
import { User } from "../../src/entities/User";
import { serialize, parse } from "cookie";

function mockContext(token?: string) {
  const value: { context: any; token?: string } = {
    token,
    context: {
      req: {
        headers: {
          cookie: token ? serialize("token", token) : undefined,
        },
        connection: { encrypted: false },
      },
      res: {
        getHeader: () => "",
        setHeader: (key: string, cookieValue: string | string[]) => {
          const parseValue = parse(
            Array.isArray(cookieValue) ? cookieValue[0] : cookieValue
          );
          if (parseValue.token) {
            value.token = parseValue.token;
          }
        },
        headers: {},
      },
    },
  };
  return value;
}

let schema: GraphQLSchema;

beforeAll(async () => {
  schema = await getSchema();

  const dataSource = new DataSource({
    ...dataSourceOptions,
    host: process.env.DB_HOST_LOCAL,
    port: Number(process.env.DB_PORT_LOCAL),
    dropSchema: true,
  });

  await dataSource.initialize();
});

describe("TEST => users resolvers", () => {
  it("should create new User", async () => {
    const mock = mockContext();
    const result = (await graphql({
      schema,
      source: print(mutationUserCreate), // print() is used to convert the gql string to a string
      variableValues: {
        data: {
          email: "zed11temp@gmail.com",
          password: "Luk12345",
        },
      },
      contextValue: mock.context,
    })) as any;
    
    expect(result?.data?.userCreate?.id).toBe("1");

    const user = await User.findOneBy({ id: result?.data?.userCreate?.id });

    expect(!!user).toBeTruthy();
    expect(user?.email).toBe("zed11temp@gmail.com");
  });

  it("should connect a User", async () => {
    const mock = mockContext();
    const result = (await graphql({
      schema,
      source: print(mutationUserLogin), // print() is used to convert the gql string to a string
      variableValues: {
        data: {
          email: "zed11temp@gmail.com",
          password: "Luk12345",
        },
      },
      contextValue: mock.context,
    })) as any;
    
    expect(result?.data?.userLogin?.id).toBe("1");
  });
});
