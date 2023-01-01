import { Alert, Button, Container, Stack, TextField } from "@mui/material";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { getUserPool } from "./config";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

interface SignInForm {
  email: string;
  password: string;
}

export const SignIn = () => {
  const { register, handleSubmit } = useForm<SignInForm>();
  const [message, setMessage] = useState("サインアップ成功");

  const signIn: SubmitHandler<SignInForm> = (data) => {
    const userPool = getUserPool();
    const userData = {
      Username: data.email,
      Pool: userPool,
    };

    const authenticationData = {
      Username: data.email,
      Password: data.password,
    };
    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        const expires = result.getAccessToken().getExpiration() * 1000;
        console.log(accessToken);
        console.log(idToken);
        console.log(refreshToken);
        console.log(expires);
        setMessage("サインイン成功");
      },

      onFailure: (err) => {
        alert(err.message || JSON.stringify(err));
      },
    });
  };

  return (
    <Container className="signIn" maxWidth="sm" sx={{ pt: 5 }}>
      <Stack spacing={2}>
        <Alert severity="success">{message}</Alert>
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
          onClick={handleSubmit(signIn)}
          color="primary"
          variant="contained"
        >
          送信
        </Button>
      </Stack>
    </Container>
  );
};