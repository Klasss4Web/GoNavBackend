import { BASE_URL } from "./endPointConstants";

export const triggerPushNotification = async (payload) => {
  try {
    // Send subscription to your backend
    const response = await fetch(
      `${BASE_URL}/push-notification/send-notification`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(`Push notification sent successfully: ${response}`);
  } catch (error) {
    console.log(`Error sending push notification ${error}`);
  }
};
