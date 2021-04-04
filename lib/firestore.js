import { auth, firestore } from "./firebase";

const alerts = firestore.collection("alerts");

export async function createUser(uid, data) {
  return firestore
    .collection("users")
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
}

export async function fetchUserData(uid) {
  const documentRef = firestore.collection("users").doc(uid);
  const snapshot = await documentRef.get();
  return snapshot.data();
}

export async function createNotificationInstance({
  phone,
  radius,
  address,
  coordinates,
}) {
  const alertPayload = {
    userId: auth.currentUser.uid,
    phone,
    radius,
    address,
    coordinates,
  };
  console.log(alertPayload);
  await alerts.add(alertPayload);
}

export async function getUserZones({ uid }) {
  const snapshots = await firestore
    .collection("alerts")
    .where("userId", "==", uid)
    .get();

  let zones = [];
  snapshots.forEach((doc) => {
    if (doc.exists) {
      zones.push({ id: doc.id, ...doc.data() });
    }
  });
  console.log(zones);
  return zones;
}
