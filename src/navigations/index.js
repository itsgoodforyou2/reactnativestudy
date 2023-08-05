import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { ProgressContext, UserContext } from "../contexts";
import { Spinner } from "../components";
import MainStack from "./MainStack";

const Navigation = () => {
  const { inProgress } = useContext(ProgressContext);
  const { user } = useContext(UserContext);
  return (
    <NavigationContainer>
      {/* 인증스택컴포넌트를 실행 */}
      {user?.uid && user?.email ? <MainStack /> : <AuthStack />}
      {inProgress && <Spinner />}
    </NavigationContainer>
  );
};

export default Navigation;
