import { Config } from "@/config/config";
import { app } from "@/context/UserContext";
import Realm from "realm";
export const {
  BSON: { ObjectId },
} = Realm;
export const getDBInstance = (appInstance: any) => {
  return appInstance.currentUser
    .mongoClient(Config.mongoDb.client)
    .db(Config.mongoDb.db);
};
export const registerDetails = async ({
  user,
  email,
  userName,
  phoneNumber,
  description,
  type,
}: any) => {
  const data = {
    email,
    englishName: userName,
    number: phoneNumber,
    englishBio: description,
    type,
  };
  if (!data) {
    return;
  }
  // console.log('data', typeof data);
  const result = await user.callFunction("registerProvider", {
    data,
  });
  // console.log('result=', typeof result);
  // if (app.currentUser) {
  //   app.currentUser.logOut();
  // }
  return result;
};

export const updateFirebaseTokenWhenLogin = async ({
  providerId,
  fcmToken,
}: any) => {
  if (!app || !app.currentUser) {
    return;
  }
  if (!providerId) {
    return;
  }
  if (typeof providerId === "string") {
    providerId = new ObjectId(providerId);
  }

  const provider = await getDBInstance(app).collection("providers").findOne({
    _id: providerId,
  });

  if (
    provider &&
    provider.firebase_tokens &&
    provider.firebase_tokens.includes(fcmToken)
  ) {
    // Token already exists, no need to add it again
    return { success: true, message: "Token already exists" };
  }

  const result = await getDBInstance(app)
    .collection("providers")
    .updateOne(
      {
        _id: providerId,
      },
      {
        $push: {
          firebase_tokens: fcmToken,
        },
      }
    );

  return result;
};

export const getCurrentProvider = async ({providerId}: any) => {
    // console.log("got value", providerId);
    if (!app || !app.currentUser) {
      return;
    }
  
    if (!providerId) {
      return;
    }
    if (typeof providerId === 'string') {
      providerId = new ObjectId(providerId);
    }
  
    const result = await getDBInstance(app)
      .collection('providers')
      .aggregate([
        {
          $match: {
            _id: providerId,
          },
        },
        {
          $lookup: {
            from: 'branches',
            localField: '_id',
            foreignField: 'providerId',
            as: 'branch',
          },
        },
  
        {
          $unwind: '$branch',
        },
      ]);
  
    return result[0];
  };
  