import { Resolver, Mutation, Arg, Ctx, ID, Authorized } from "type-graphql";
import { Picture, PictureCreateInput } from "../entities/Picture";
import {
  createImage,
  deletePicture,
} from "../utils/pictureServices/pictureServices";
import { MyContext } from "../index";

@Resolver(Picture)
export class PictureResolver {
  @Authorized("ADMIN", "USER")
  @Mutation(() => Picture)
  async createPicture(
    @Ctx() context: MyContext,
    @Arg("data", () => PictureCreateInput) data: PictureCreateInput
  ): Promise<Picture> {
    if (!context.user) {
      throw new Error("Not authenticated");
    }
    return createImage(data.filename);
  }

  @Authorized("ADMIN", "USER")
  @Mutation(() => Picture, { nullable: true })
  async pictureDelete(
    @Ctx() context: MyContext,
    @Arg("id", () => ID) id: number
  ): Promise<Picture | null> {
    if (!context.user) {
      throw new Error("Not authenticated");
    }
    return deletePicture(id);
  }
}
