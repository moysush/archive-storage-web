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
  Alert,
} from "@mui/material";

type modeType = "light" | "dark";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [mode, setMode] = useState<modeType>(
    (localStorage.getItem("themeMode") as modeType) || "light",
  );
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#C1E1C1",
        // light: "#77DD77",
        // dark: "#C1E1C1",
      },
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

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

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
                  <Button
                    style={{ color: "inherit", textDecoration: "none" }}
                    onClick={() => navigate("/login")}
                  >
                    login
                  </Button>

                  <Button
                    style={{ color: "inherit", textDecoration: "none" }}
                    onClick={() => navigate("/signup")}
                  >
                    sign up
                  </Button>
                </>
              )}
              {user && (
                <Button sx={{ color: "inherit" }} onClick={handleSignout}>
                  Sign out
                </Button>
              )}
            </Toolbar>
          </AppBar>
          {message && (
            <Alert
              sx={{ mb: 2, borderRadius: 2 }}
              severity={message.includes("success") ? "success" : "error"}
              action={
                message.includes("sure") && (
                  <Button color="inherit" size="small">
                    UNDO
                  </Button>
                )
              }
            >
              {message}
            </Alert>
          )}
          <Routes>
            <Route
              path="/"
              element={
                <Documents
                  user={user}
                  setUser={setUser}
                  setMessage={setMessage}
                />
              }
            />
            <Route
              path="/login"
              element={
                <Login user={user} setUser={setUser} setMessage={setMessage} />
              }
            />
            <Route
              path="/signup"
              element={
                <Signup user={user} setUser={setUser} setMessage={setMessage} />
              }
            />
          </Routes>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
