import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase";
import type { User } from "@supabase/supabase-js";
import { NavLink, Route, Routes } from "react-router";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Documents from "./components/Documents";

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
      // console.log(data.session?.user);
    }; 

    loadSession();
  }, []);

  return (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/signup">Signup</NavLink>
      {}
      <h2>Hello, World</h2>
      <Login user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<h2>Homeeee</h2>} />
        <Route
          path="/signup"
          element={<Signup user={user} setUser={setUser} />}
        />
      </Routes>
      <Documents user={user} setUser={setUser}/>
    </>
  );
}

export default App;
