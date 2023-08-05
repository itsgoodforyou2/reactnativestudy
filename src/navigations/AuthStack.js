import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Login, Signup } from "../screens";

const Stack = createStackNavigator();

/*인증스택 컴포넌트 정의 */
const AuthStack = () => {
  const theme = useContext(ThemeContext);
  return (
    <Stack.Navigator
      initialRouteName="Login" /*기본 화면 지정(로그인페이지) */
      screenOptions={{
        headerTitleAlign: "center",
        cardStyle: { backgroundColor: theme.background },
        headerTintColor: theme.headerTintColor,
      }}
    >
      {/* 로그인 스크린 */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      {/* 회원가입 스크린 */}
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerBackTitleVisible: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
