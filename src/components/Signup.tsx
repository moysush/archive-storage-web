import { useState } from "react";
import { supabase } from "../utils/supabase";
import type { UserProps } from "./Login";
import {
  TextField,
  FormGroup,
  Typography,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router";

const Signup = ({ setUser, setMessage }: UserProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      console.log(data);
      if (data.session !== null) {
        setUser(data.session?.user ?? null);
        setMessage("Signed up successfully");
        navigate("/");
      } else if (error) {
        setMessage(error?.message);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
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
          Sign up
        </Typography>
        <FormGroup sx={{ gap: 2, width: 300, m: "0 auto" }}>
          <TextField
            variant="outlined"
            placeholder="email"
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
          <TextField
            variant="outlined"
            placeholder="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button variant="contained" onClick={handleSignUp}>
            Sign up
          </Button>
        </FormGroup>
      </Paper>
    </Box>
  );
};

export default Signup;
