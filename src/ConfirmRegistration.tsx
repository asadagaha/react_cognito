import React from 'react'
import { Button, Container, Stack, TextField } from "@mui/material";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { getUserPool } from "./config";
import { SubmitHandler, useForm } from "react-hook-form";

interface ConfirmRegistrationForm {
  code: string;
}

interface Props {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  email: string;
}

export const ConfirmRegistration = (props: Props) => {
  const { register, handleSubmit } = useForm<ConfirmRegistrationForm>();

  const confirmRegistration: SubmitHandler<ConfirmRegistrationForm> = (
    data
  ) => {
    const userPool = getUserPool();
    const userData = {
      Username: props.email,
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(data.code, true, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      props.setStatus("confirmed");
    });
  };

  return (
    <Container className="unconfirmed" maxWidth="sm" sx={{ pt: 5 }}>
      <Stack spacing={2}>
        <TextField required label="認証コード" {...register("code")} />
        <Button
          onClick={handleSubmit(confirmRegistration)}
          color="primary"
          variant="contained"
        >
          送信
        </Button>
      </Stack>
    </Container>
  );
};