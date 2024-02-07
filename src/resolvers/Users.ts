import {
  Arg,
  Query,
  Resolver,
  Mutation,
  Ctx,
  Authorized,
  ID,
} from "type-graphql";
import {
  User,
  UserContext,
  UserCreateInput,
  UserLoginInput,
  UserUpdateInput,
  VerifyEmailResponse,
} from "../entities/User";
import { validate } from "class-validator";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { MyContext } from "../index";
import Cookies from "cookies";
import { Picture } from "../entities/Picture";
import { deletePicture } from "../utils/pictureServices/pictureServices";
import {
  sendVerificationEmail,
  sendConfirmationEmail,
} from "../utils/mailServices/verificationEmail";
import { generateSecurityCode } from "../utils/utils";
import { VerificationCode } from "../entities/VerificationCode";

@Resolver(User)
export class UsersResolver {
  @Authorized("ADMIN")
  @Query(() => [User])
  async usersGetAll(@Ctx() context: MyContext): Promise<User[]> {
    if (context.user?.role === "ADMIN") {
      const users = await User.find();
      return users;
    } else {
      throw new Error("Not authorized");
    }
  }

  @Mutation(() => User)
  async userCreate(
    @Ctx() context: MyContext,
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    // Validate input data before creating User entity
    const inputsDataErrors = await validate(data);
    if (inputsDataErrors.length > 0) {
      throw new Error(
        `Inputs data validation error : ${JSON.stringify(inputsDataErrors)}`
      );
    }

    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = new User();

    // createdBy = newUser || adminUser. Depends if token is present in context.
    const cookie = new Cookies(context.req, context.res);
    const token = cookie.get("renthub_token"); // TODO verify JWT token name inside userLogin resolver
    let adminUser: User | null = null;
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
      if (typeof payload === "object" && "userId" in payload) {
        const user = await User.findOne({
          where: { id: payload.userId },
          relations: {
            picture: true,
            // TODO add relations to adminUser if needed. For example Role.
          },
        });
        // TODO add extra condition : if(adminUser.role === "ADMIN" || adminUser.role === "SUPERADMIN")
        adminUser = user;
      } else {
        throw new Error("Token invalid");
      }
    }

    Object.assign(newUser, data, {
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      createdBy: adminUser || newUser,
    });

    //
    try {
      newUser.hashedPassword = await argon2.hash(data.password);
    } catch (error) {
      throw new Error(`Error hashing password: ${error}`);
    }

    const errors = await validate(newUser);
    if (errors.length === 0) {
      await newUser.save();

      const verificationCodeLength = 8;
      const verificationCode = generateSecurityCode(verificationCodeLength);

      const emailVerificationCode = new VerificationCode();
      emailVerificationCode.code = verificationCode;
      emailVerificationCode.type = "email-verification";
      emailVerificationCode.expirationDate = new Date(
        Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      );
      emailVerificationCode.user = newUser;

      await emailVerificationCode.save();
      await sendVerificationEmail(newUser.id, newUser.email, verificationCode);
    }
    return newUser;
  }

  @Mutation(() => VerifyEmailResponse)
  async verifyEmail(@Arg("token") token: string): Promise<VerifyEmailResponse> {
    let userEmail: string | null = null;
    let userNickName: string | null = null;

    try {
      const decodedToken = jwt.decode(token);
      if (
        typeof decodedToken === "object" &&
        decodedToken &&
        "email" in decodedToken
      ) {
        userEmail = decodedToken.email;
        userNickName = decodedToken.nickName;
      }

      const payload = jwt.verify(
        token,
        process.env.JWT_VERIFY_EMAIL_SECRET_KEY || ""
      );
      if (typeof payload === "object" && payload.email) {
        const user = await User.findOneBy({ email: payload.email });
        if (!user) {
          return { success: false, message: "Utilisateur non trouvé" };
        }

        user.isVerified = true;
        await user.save();
        await sendConfirmationEmail(user.email, user.nickName);
        return { success: true, message: "Email vérifié avec succès !" };
      } else {
        return { success: false, message: "Invalid Token" };
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError && userEmail && userNickName) {
        // await sendVerificationEmail(userEmail, userNickName);
        return {
          success: false,
          message:
            "Le lien a expiré, un nouveau lien de vérification a été envoyé à votre adresse email.",
        };
      } else {
        return { success: false, message: "Error verifying email." };
      }
    }
  }

  @Mutation(() => User)
  async userLogin(
    @Ctx() context: MyContext,
    @Arg("data", () => UserLoginInput) data: UserLoginInput
  ) {
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }
    if (!user.isVerified) {
      throw new Error("Email non vérifié, consultez votre boite mail");
    }

    const valid = await argon2.verify(user.hashedPassword, data.password);
    if (!valid) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() + 2 * 60 * 60 * 1000),
        userId: user.id,
      },
      process.env.JWT_SECRET_KEY || ""
    );

    const cookie = new Cookies(context.req, context.res);
    cookie.set("TGCookie", token, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });
    return user;
  }

  @Authorized("ADMIN", "USER")
  @Query(() => UserContext)
  async meContext(@Ctx() context: MyContext): Promise<UserContext> {
    if (!context.user) {
      throw new Error("User not found");
    }
    const user = context.user as UserContext;
    return user;
  }

  @Authorized("ADMIN", "USER")
  @Query(() => User)
  async me(@Ctx() context: MyContext): Promise<User> {
    if (!context.user) {
      throw new Error("User not found");
    }
    const user = await User.findOne({
      where: { id: context.user.id },
      relations: { picture: true },
    });

    return user as User;
  }

  @Mutation(() => Boolean)
  async userSignOut(@Ctx() context: MyContext): Promise<Boolean> {
    const cookie = new Cookies(context.req, context.res);
    cookie.set("TGCookie", "", {
      httpOnly: true,
      secure: false,
      maxAge: 0,
    });
    return true;
  }

  @Authorized("ADMIN", "USER")
  @Mutation(() => User, { nullable: true })
  async userUpdate(
    @Ctx() context: MyContext,
    @Arg("data") data: UserUpdateInput
  ): Promise<User | null> {
    const userId = context.user?.id;

    const user = await User.findOne({
      where: { id: userId },
      relations: { picture: true },
    });

    if (
      user &&
      (user.id === context.user?.id || context.user?.role === "ADMIN")
    ) {
      let oldPictureId: number | null = null;
      if (data.pictureId && user.picture?.id) {
        oldPictureId = user.picture.id;
        const newPicture = await Picture.findOne({
          where: { id: data.pictureId },
        });
        if (!newPicture) {
          throw new Error("New picture not found");
        }
        user.picture = newPicture;
      }

      Object.assign(user, data);

      const errors = await validate(user);
      if (errors.length === 0) {
        await User.save(user);
        if (oldPictureId) {
          await deletePicture(oldPictureId);
        }

        return await User.findOne({
          where: { id: userId },
        });
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`);
      }
    }
    return user;
  }

  @Authorized("ADMIN", "USER")
  @Mutation(() => User, { nullable: true })
  async userDelete(
    @Ctx() context: MyContext,
    @Arg("id", () => ID) id: number
  ): Promise<User | null> {
    const user = await User.findOne({
      where: { id: id },
    });
    if (
      user &&
      (user.id === context.user?.id || context.user?.role === "ADMIN")
    ) {
      const pictureId = user.picture?.id;
      await user.remove();
      if (pictureId) {
        await deletePicture(pictureId);
      }
      user;
    } else {
      throw new Error(`Error delete user`);
    }
    return user;
  }
}
