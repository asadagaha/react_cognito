import React from 'react'
import { Button, Container, Stack, TextField } from "@mui/material";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { getUserPool } from "./config";
import { SubmitHandler, useForm } from "react-hook-form";

interface SignUpForm {
  email: string;
  password: string;
}

interface Props {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

export const SignUp = (props: Props) => {
  const { register, handleSubmit } = useForm<SignUpForm>();

  const signUp: SubmitHandler<SignUpForm> = (data) => {
    const formValue = {
      email: data.email,
      password: data.password,
    };

    const attributeList = [];

    const dataEmail = {
      Name: "email",
      Value: data.email,
    };

    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    );

    attributeList.push(attributeEmail);

    const validationData: AmazonCognitoIdentity.CognitoUserAttribute[] = [];

    const userPool = getUserPool();

    userPool.signUp(
      formValue.email,
      formValue.password,
      attributeList,
      validationData,
      (err, result) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        const cognitoUser = result!.user;
        console.log("user name is " + cognitoUser.getUsername());
        props.setStatus("unconfirmed");
        props.setEmail(data.email);
      }
    );
  };

  return (
    <Container className="unregistered" maxWidth="sm" sx={{ pt: 5 }}>
      <Stack spacing={2}>
        <TextField
          required
          label="メールアドレス"
          type="email"
          {...register("email")}
        />
        <TextField
          required
          label="パスワード"
          type="password"
          {...register("password")}
        />
        <Button
          onClick={handleSubmit(signUp)}
          color="primary"
          variant="contained"
        >
          送信
        </Button>
      </Stack>
    </Container>
  );
};