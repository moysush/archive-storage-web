import { useState } from "react";
import { supabase } from "../utils/supabase";
import type { UserProps } from "./Login";

const Signup = ({ setUser }: UserProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const { data } = await supabase.auth.signUp({
      email,
      password,
    });
    setUser(data.session?.user ?? null);
  };

  return (
    <div>
      <div>
        <input
          placeholder="email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
        />
        <input
          placeholder="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <button onClick={handleSignUp}>Sign up</button>
      </div>
    </div>
  );
};

export default Signup;
