import React, { useState, forwardRef } from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";

/*스타일드컴포넌트 - Container : View컴포넌트를 재정의*/
const Container = styled.View`
  flex-direction: column; /*컨테이너 내의 아이템 배치할때 위에서 아래방향으로 배치*/
  width: 100%; /*가로폭 100%(꽉채움)*/
  margin: 10px 0; /*상하 10px 여백, 좌우 여백은 0*/
`;

/*스타일드컴포넌트 - Label : Text컴포넌트를 재정의*/
const Label = styled.Text`
  font-size: 14px; /*글자 크기*/
  font-weight: 600; /*글자 두께*/
  margin-bottom: 6px; /*바로 아래 컴포넌트간 여백 6px*/
  /*theme, isFocused를 프롭스로 전달받아서 isFocused bool 값에따라 
  true이면 theme.text에 정의된값을, false이면 theme.label에 정의된값을 사용*/
  color: ${({ theme, isFocused }) => (isFocused ? theme.text : theme.label)};
`;

/*스타일드컴포넌트 - StyledTextInput : TextInput컴포넌트를 재정의 */
const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor:
    theme.inputPlaceholder /*플레이스홀더색상의 경우 attrs를 사용하여 프롭스를 사용함. */,
}))`
  background-color: ${({ theme, editable }) =>
    editable
      ? theme.background
      : theme.inputDisabledBackground}; /*백그라운드 컬러를 theme 프롭스를 활용하여 설정 */
  color: ${({ theme }) => theme.text};
  padding: 20px 10px; /*산하여백 20px, 좌우여백 10px*/
  font-size: 16px; /*글자 크기*/
  border: 1px solid /*테두리 1px*/ /*프롭스로 받은 theme을 활용하여 색상설정 */
    ${({ theme, isFocused }) => (isFocused ? theme.text : theme.inputBorder)};
  border-radius: 4px; /*모서리 둥글게*/
`;

/*Input컴포넌트 정의 - 프롭스로 받는 값 label, value 부터 ~ maxLength까지.. */
/*ref는 특별히 자식 컴포넌트의 props로 전달되지 않기 때문에 forwardRef 함수를 써서 
  전달받게 할 수 있음.*/
const Input = forwardRef(
  (
    {
      label,
      value,
      onChangeText,
      onSubmitEditing,
      onBlur,
      placeholder,
      isPassword,
      returnKeyType,
      maxLength,
      disabled,
    },
    ref
  ) => {
    /*useState를 사용하여 컴포넌트 포커스 유무상태 저장*/
    const [isFocused, setIsFocused] = useState(false);

    return (
      /*컨테이너가 제일 최상위 컴포넌트, 
      그리고 라벨컴포넌트의 프롭스인 isFocused로 
      Input 컴포넌트의 프롭스 isFocused를 넘김, 나머지도 같은 원리*/
      <Container>
        <Label isFocused={isFocused}>{label}</Label>
        <StyledTextInput
          ref={ref}
          isFocused={isFocused}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          placeholder={placeholder}
          secureTextEntry={isPassword}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          editable={!disabled}
        />
      </Container>
    );
  }
);

Input.defaultProps = {
  onBlur: () => {},
  onChangeText: () => {},
  onSubmitEditing: () => {},
};

Input.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  isPassword: PropTypes.bool,
  returnKeyType: PropTypes.oneOf(["done", "next"]),
  maxLength: PropTypes.number,
  disabled: PropTypes.bool,
};

export default Input;
