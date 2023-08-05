import * as firebase from "firebase/app";
import config from "../../firebase.json";
import * as auth from "firebase/auth";
import { withRepeat } from "react-native-reanimated";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getFirestore,
} from "firebase/firestore";

/*1.파이어베이스 앱 초기화 */
export const app = firebase.initializeApp(config);

/*2.인증함수호출 */
const Auth = auth.getAuth();

export const login = async ({ email, password }) => {
  /*이메일과비밀번호인증함수 사용하여 로그인 */
  /*다음링크 참조할것 */
  /*https://firebase.google.com/docs/auth/web/password-auth?hl=ko */
  const { user } = await auth.signInWithEmailAndPassword(Auth, email, password);
  return user;
};

const uploadImage = async (uri) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const user = Auth.currentUser;
  const storage = getStorage();
  // storage에 업로드 경로 생성
  const profileRef = ref(storage, `/profile/${user.uid}/photo.png`);
  // blob(사진파일)을 경로에 업로드한다
  await uploadBytes(profileRef, blob, {
    connectType: "image/png",
  });
  blob.close();

  // 업로드한 사진 주소 반환
  return await getDownloadURL(profileRef);
};

export const signup = async ({ email, password, name, photoUrl }) => {
  const { user } = await auth.createUserWithEmailAndPassword(
    Auth,
    email,
    password
  );
  const storageUrl = photoUrl.startsWith("https")
    ? photoUrl
    : await uploadImage(photoUrl);
  /*const storageUrl = await uploadImage(photoUrl);*/
  await auth.updateProfile(Auth.currentUser, {
    displayName: name,
    photoURL: storageUrl,
  });
  return user;
};

export const logout = async () => {
  return await Auth.signOut();
};

export const getCurrentUser = () => {
  const { uid, displayName, email, photoURL } = Auth.currentUser;
  return { uid, name: displayName, email, photoUrl: photoURL };
};

export const updateUserPhoto = async (photoUrl) => {
  const user = Auth.currentUser;
  const storageUrl = photoUrl.startsWith("https")
    ? photoUrl
    : await uploadImage(photoUrl);
  await auth.updateProfile(Auth.currentUser, {
    photoURL: storageUrl,
  });

  return { name: user.displayName, email: user.email, photoUrl: user.photoURL };
};

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

/*아마 오류발생할듯.. */
export const createChannel = async ({ title, description }) => {
  try {
    const newChannelRef = doc(collection(db, "channels"));
    const id = newChannelRef.id;
    const newChannel = {
      id,
      title,
      description,
      createAt: Date.now(),
    };
    await setDoc(newChannelRef, newChannel);

    console.log("Document written with ID ", newChannelRef.id);

    /*id를 리턴한다.*/
    return id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
