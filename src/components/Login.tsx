import { useState } from "react";
import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";

export type UserProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const Login = ({ user, setUser }: UserProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    await supabase.auth.signInWithPassword({ email, password });
    const { data } = await supabase.auth.getSession();
    setUser(data.session?.user ?? null);
    setEmail("");
    setPassword("");
  };

  const onSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div>
      {user ? null : (
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
          <button onClick={onLogin}>Sign in</button>
        </div>
      )}
      {user && <button onClick={onSignOut}>Sign out</button>}
    </div>
  );
};

export default Login;
