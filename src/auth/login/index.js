import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { notification } from "antd";  // Importing antd notification

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayoutLanding from "layouts/authentication/components/BasicLayoutLanding";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import AuthService from "services/auth-service";
import { AuthContext } from "context";
import axios from "axios";

function Login() {
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [credentialsErrors, setCredentialsError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    emailError: false,
    passwordError: false,
  });

  const addUserHandler = (newUser) => setUser(newUser);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when the form is submitted

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true });
      setLoading(false); // Stop loading if validation fails
      return;
    }

    if (inputs.password.trim().length < 6) {
      setErrors({ ...errors, passwordError: true });
      setLoading(false); // Stop loading if validation fails
      return;
    }

    const newUser = { email: inputs.email, password: inputs.password };
    addUserHandler(newUser);

    const myData = {
      data: {
        type: "token",
        attributes: { ...newUser },
      },
    };

    try {
      const response = await AuthService.login(myData);
      
      // Show notification on successful sign in
      notification.success({
        message: 'Sign in successful!',
        description: 'You have signed in successfully.',
        placement: 'topRight', // You can change placement if needed
      });

      // Perform login logic here
      authContext.login(response.access_token, response.refresh_token);
      setLoading(false); // Stop loading after successful login
    } catch (res) {
      setLoading(false); // Stop loading if there's an error
      if (res.hasOwnProperty("message")) {
        setCredentialsError(res.message);
      } else {
        setCredentialsError(res.errors[0].detail);
      }
    }

    setInputs({
      email: "",
      password: "",
    });

    setErrors({
      emailError: false,
      passwordError: false,
    });
  };

  const [token, setToken] = useState("");
  const [shopId, setShopId] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenParam = queryParams.get('token');
    const shopIdParam = queryParams.get('shopId');
    setToken(tokenParam);
    setShopId(shopIdParam);

    const sendDataToBackend = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}api/v1/auth/loginAsAdmin`, {
          token: tokenParam,
          shopId: shopIdParam
        });

        authContext.login(response.data.access_token, response.data.refresh_token);

      } catch (error) {
        console.error('Error sending data to backend:', error);
      }
    };

    if (tokenParam && shopIdParam) {
      sendDataToBackend();
    }

  }, [authContext]);

  return (
    <BasicLayoutLanding image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" method="POST" onSubmit={submitHandler}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={inputs.email}
                name="email"
                onChange={changeHandler}
                error={errors.emailError}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                name="password"
                value={inputs.password}
                onChange={changeHandler}
                error={errors.passwordError}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={loading} // Disable button when loading
              >
                {loading ? "Signing in..." : "Sign in"} {/* Show loading text when submitting */}
              </MDButton>
            </MDBox>
            {credentialsErrors && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {credentialsErrors}
              </MDTypography>
            )}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Forgot your password? Reset it{" "}
                <MDTypography
                  component={Link}
                  to="/auth/forgot-password"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  here
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayoutLanding>
  );
}

export default Login;
