import { useState } from "react";
import { SignUp } from "./SignUp";
import { ConfirmRegistration } from "./ConfirmRegistration";
import { SignIn } from "./SignIn";


const App = () => {
  const [status, setStatus] = useState("unregistered");
  const [email, setEmail] = useState("");

  return (
    <>
      {status === "unregistered" && (
        <SignUp setStatus={setStatus} setEmail={setEmail} />
      )}
      {status === "unconfirmed" && (
        <ConfirmRegistration setStatus={setStatus} email={email} />
      )}
      {status === "confirmed" && <SignIn />}
    </>
  );
};

export default App;