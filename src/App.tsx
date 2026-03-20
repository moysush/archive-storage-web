import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase";
import type { User } from "@supabase/supabase-js";
import { NavLink, Route, Routes, useNavigate } from "react-router";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Documents from "./components/Documents";
import {
  AppBar,
  Container,
  CssBaseline,
  Typography,
  Toolbar,
  Button,
  Box,
  createTheme,
  ThemeProvider,
  Switch,
} from "@mui/material";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = createTheme({
    palette: {
      mode,
    },
  });

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

  const handleSignout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ position: "relative" }}>
          <AppBar
            position="static"
            elevation={1}
            sx={{ my: 4, py: 2, borderRadius: 2 }}
            enableColorOnDark={true}
          >
            <Toolbar>
              <Typography variant="h4" component="h1">
                <NavLink
                  style={{ color: "inherit", textDecoration: "none" }}
                  to="/"
                >
                  Archive Storage
                </NavLink>
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Switch
                checked={mode === "dark"}
                onChange={() => setMode(mode === "dark" ? "light" : "dark")}
                color="default"
              />
              {!user && (
                <>
                  <NavLink
                    style={{ color: "inherit", textDecoration: "none" }}
                    to="/login"
                  >
                    login
                  </NavLink>

                  <NavLink
                    style={{ color: "inherit", textDecoration: "none" }}
                    to="/signup"
                  >
                    Sign up
                  </NavLink>
                </>
              )}
              {user && (
                <Button sx={{ color: "inherit" }} onClick={handleSignout}>
                  Sign out
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <Routes>
            <Route
              path="/"
              element={<Documents user={user} setUser={setUser} />}
            />
            <Route
              path="/login"
              element={<Login user={user} setUser={setUser} />}
            />
            <Route
              path="/signup"
              element={<Signup user={user} setUser={setUser} />}
            />
          </Routes>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
