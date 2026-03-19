import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase";
import type { User } from "@supabase/supabase-js";
import { Link, NavLink, Route, Routes } from "react-router";
import Login from "./components/Login";
import Signup from "./components/Signup";

// const testAuth = async () => {
  // await supabase.auth.signOut();
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email: "hiraku.kazuma5@gmail.com",
  //   password: "H+gh9)7r+;L$Xf8",
  // });
  // const { data: signup } = await supabase.auth.signUp({
  //   email: "m.hossain.sushmoy@gmail.com",
  //   password: "password",
  // });
  // console.log(signup);
  // const { data: authData, error } = await supabase.auth.signInWithPassword({
  //   email: "m.hossain.sushmoy@gmail.com",
  //   password: "password",
  // });
  // console.log(data);
  // const { data: profileSet } = await supabase
  //   .from("profiles")
  //   .insert({
  //     id: authData?.user?.id,
  //     username: "sushmoy"
  //   });
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // console.log(user);
  // const { data: profileSet } = await supabase
  //   .from("profiles")
  //   .select("*")
  //   .limit(1);
  // console.log(profileSet);
  // Now that we are logged in, let's see if RLS lets us see that test row
  // const { data: files, error: fileError } = await supabase
  //   .from("files")
  //   .select("*");
  // console.log(files);
// };

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        return;
      }
      setUser(data.session?.user ?? null);
      console.log(data.session?.user);
    };

    loadSession();
  }, []);

  return (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/signup">Signup</NavLink>
      <h2>Hello, World</h2>
      <Routes>
        <Route path="/" element={<h2>Homeeee</h2>} />
        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />
        <Route
          path="/signup"
          element={<Signup user={user} setUser={setUser} />}
        />
      </Routes>

      
    </>
  );
}

export default App;
