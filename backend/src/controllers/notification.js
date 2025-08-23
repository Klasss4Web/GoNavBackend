import webpush from "web-push";
import dotenv from "dotenv";

dotenv.config();

// import logger from "../utils/logger.ts";
import Subscription from "../models/notificationModel.js";

const vapidDetails = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  "mailto:eochade15@gmail.com",
  vapidDetails.publicKey,
  vapidDetails.privateKey
);

export const subscribeToPushNotification = async (req, res) => {
  try {
    const { subscription, routeCode } = req.body;
    const { endpoint, keys } = subscription;

    // Prevent duplicate subscriptions (unique by endpoint)
    // const existing = await Subscription.findOne({
    //   endpoint: subscription.endpoint,
    // });
    await Subscription.findOneAndUpdate(
      { endpoint }, //add userId here, when it is added. match by endpoint (unique)
      { routeCode, endpoint, keys }, //add userId when users are used,
      { upsert: true, new: true }
    );

    console.log(`📩 Subscription saved:, ${subscription.endpoint}✅`);
    res.status(201).json({ message: "Subscription saved in DB" });
  } catch (err) {
    console.error("DB error:", err);
    console.error(`⚠️Subscription DB error:", ${err}`);
    res.status(500).json({ error: "Failed to save subscription" });
  }
};

export const sendPushNotification = async (req, res) => {
  const payload = JSON.stringify(
    req.body || {
      title: "Alert 🔔",
      body: "Bus Notification Test!",
      url: "/",
      vibrate: [200, 100, 200],
      requireInteraction: true,
    }
  );
  const { routeCode } = req.body;
  if (!routeCode) {
    return res.status(400).json({ Message: "routeCode is required" });
  }
  const subs = await Subscription.find({ routeCode });
  if (!subs.length) {
    return res.status(404).json({ Message: "No subscriptions for this user" });
  }
  const results = await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, payload);
        console.log(`Push notification sent successfull`);
      } catch (err) {
        console.error("Push failed:", err);
        // logger.error(`Push failed: ${err}`);
        // Cleanup invalid subscriptions
        if (err.statusCode === 410 || err.statusCode === 404) {
          await Subscription.deleteOne({ _id: sub._id });
          console.log("🗑 Removed expired subscription:", sub.endpoint);
        }
      }
    })
  );

  res.json({ sent: results.length });
};

// STEPS
// npm install web-push
// npx web-push generate-vapid-keys
// Public Key:  BEXAMPLEc9nGm...
// Private Key:  1EXAMPLE7uA...
// VAPID_PUBLIC_KEY=BEXAMPLEc9nGm...
// VAPID_PRIVATE_KEY=1EXAMPLE7uA...
