import {
  makeStyles,
  Container,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  SnackbarContent,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import fetch from "isomorphic-unfetch";
import { useState } from "react";
import * as Yup from "yup";
import Router from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 20px",
  },
  signupContainer: {
    margin: "10vh 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    [theme.breakpoints.up("lg")]: {
      width: "30%",
    },
    [theme.breakpoints.down("md")]: {
      width: "40%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "50%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  errorText: {
    fontSize: "12px",
    color: theme.palette.error.main,
  },
  snackBarErr: {
    backgroundColor: theme.palette.error.main,
  },
}));

const signup = () => {
  const classes = useStyles();
  const api = process.env.API_URL;
  const [matchUser, setMatchUser] = useState(false);
  const [failed, setFailed] = useState(false);
  // const [user, setUser] = useState("");

  const formProps = {
    margin: "dense",
    size: "small",
    required: true,
    fullWidth: true,
    autoComplete: "off",
    variant: "outlined",
  };

  const validation = Yup.object().shape({
    name: Yup.string().min(2, "Too short!").max(75, "Too long!"),
    email: Yup.string().email("Invalid email!"),
    username: Yup.string(),
    password: Yup.string().min(8, "Password must be at least 8 characters"),
    passconf: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Password not match"
    ),
  });

  // const handleBlur = async () => {
  //   console.log(user);

  //   const checkUser = await fetch("http://localhost:3000/api/usercheck", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ userInput: user }),
  //   });
  //   const result = await checkUser.json();
  //   console.log(result);
  //   setMatchUser(result.match);
  // };

  return (
    <Container className={classes.root} maxWidth="xl">
      {failed && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open
          autoHideDuration={3000}
        >
          <SnackbarContent
            className={classes.snackBarErr}
            message="Oops, something went wrong"
          />
        </Snackbar>
      )}

      <Card className={classes.signupContainer}>
        <CardHeader
          title="Sign Up 🚀"
          titleTypographyProps={{ variant: "h4", align: "center" }}
        />
        <CardContent>
          <Formik
            initialValues={{
              name: "",
              email: "",
              username: "",
              password: "",
              passconf: "",
            }}
            validationSchema={validation}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const submit = await fetch(api + "/signup", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
              });
              const response = await submit.json();
              const redirect = submit.headers.get("Location");
              const status = submit.status;

              if (status === 400) {
                setFailed(true);
              } else {
                resetForm();
                setSubmitting(false);
                Router.push(redirect);
              }

              // console.log(response, redirect);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Field
                  name="name"
                  as={TextField}
                  type="text"
                  label="Name"
                  size="medium"
                  error={errors.name && touched.name}
                  {...formProps}
                />
                {errors.name && (
                  <div className={classes.errorText}>{errors.name}</div>
                )}
                <Field
                  name="email"
                  as={TextField}
                  type="text"
                  label="Email"
                  size="medium"
                  error={errors.email && touched.email}
                  {...formProps}
                />
                {errors.email && (
                  <div className={classes.errorText}>{errors.email}</div>
                )}
                <Field
                  name="username"
                  as={TextField}
                  id="username"
                  type="text"
                  label="Username"
                  onInput={async (e) => {
                    // setUser(e.target.value);
                    const checkUser = await fetch(api + "/usercheck", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ userInput: e.target.value }),
                    });
                    const result = await checkUser.json();
                    console.log(result);
                    if (result.match === true) {
                      setMatchUser(result.match);
                    } else setMatchUser(false);
                  }}
                  // onBlur={handleBlur}
                  error={matchUser}
                  {...formProps}
                />
                {matchUser && (
                  <div className={classes.errorText}>
                    Username not available
                  </div>
                )}
                <Field
                  name="password"
                  as={TextField}
                  type="password"
                  label="Password"
                  error={errors.password && touched.password}
                  {...formProps}
                />
                {errors.password && (
                  <div className={classes.errorText}>{errors.password}</div>
                )}
                <Field
                  name="passconf"
                  as={TextField}
                  type="password"
                  label="Confirm Password"
                  error={errors.passconf && touched.passconf}
                  {...formProps}
                />
                {errors.passconf && (
                  <div className={classes.errorText}>{errors.passconf}</div>
                )}
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  color="primary"
                  disabled={isSubmitting || matchUser}
                >
                  {isSubmitting ? (
                    <CircularProgress size={25} color="secondary" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  );
};

export default signup;
