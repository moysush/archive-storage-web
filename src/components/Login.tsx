import { useState } from "react";
import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";
import {
  TextField,
  Typography,
  Paper,
  FormGroup,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router";

export type UserProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const Login = ({ setUser }: UserProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    await supabase.auth.signInWithPassword({ email, password });
    const { data } = await supabase.auth.getSession();
    if (data) {
      setUser(data.session?.user ?? null);
      setEmail("");
      setPassword("");
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Login
        </Typography>
        <FormGroup sx={{ gap: 2, width: 300, m: "0 auto" }}>
          <TextField
            variant="outlined"
            placeholder="email"
            value={email}
            type="email"
            onChange={({ target }) => setEmail(target.value)}
          />
          <TextField
            variant="outlined"
            placeholder="password"
            value={password}
            type="password"
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button variant="contained" onClick={handleLogin}>
            Sign in
          </Button>
        </FormGroup>
      </Paper>
    </Box>
  );
};

export default Login;
