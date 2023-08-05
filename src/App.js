import React, { useState } from "react";
import { StatusBar, Image } from "react-native";
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";
import Navigation from "./navigations";
import { images } from "./utils/images";
import { ProgressProvider, UserProvider } from "./contexts";

const cacheImages = (images) => {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};
const cacheFonts = (fonts) => {
  return fonts.map((font) => Font.loadAsync(font));
};

const App = () => {
  const [isReady, setIsReady] = useState(false);

  /*비동기 함수로 splash.png이미지와, 로고이미지 미리 불러오기 */
  const _loadAssets = async () => {
    const imageAssets = cacheImages([
      require("../assets/splash.png"),
      ...Object.values(images),
    ]);
    const fontAssets = cacheFonts([]);

    /*비동기 활동을 모두 완료하고 진행해야할 때 Promise.All을 사용*/
    await Promise.all([...imageAssets, ...fontAssets]);
  };

  /*AppLoading 컴포넌트 안에 내용이 완료되면, isReady == True 이면 본문? 띄움*/
  return isReady ? (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <ProgressProvider>
          <StatusBar barStyle="dark-content" />
          {/* 네비게이션 컴포넌트 띄움 */}
          <Navigation />
        </ProgressProvider>
      </UserProvider>
    </ThemeProvider>
  ) : (
    <AppLoading
      /*비동기동작 시작시 _loadAssets함수를 실행시켜 이미지와 폰트를 불러옴*/
      startAsync={_loadAssets}
      /*끝나면 스테이트값을 true로 변경. */
      onFinish={() => setIsReady(true)}
      /*에러시에는 경고메세지*/
      onError={console.warn}
    />
  );
};

export default App;
