import { firestore } from "./firebase";

const alerts = firestore.collection("alerts");

export async function createUser(uid, data) {
  const userData = await fetchUserData(uid);
  const selectedImpact = userData?.impact ?? "broad";
  return firestore
    .collection("users")
    .doc(uid)
    .set({ uid, ...data, impact: selectedImpact }, { merge: true });
}

export async function fetchUserData(uid) {
  const documentRef = firestore.collection("users").doc(uid);
  const snapshot = await documentRef.get();
  return snapshot.data();
}

export async function createNotificationInstance({
  phone,
  radius,
  coordinates,
}) {
  const alertPayload = {
    phone,
    radius,
    coordinates,
  };
  console.log(alertPayload);
  await alerts.add(alertPayload);
}
