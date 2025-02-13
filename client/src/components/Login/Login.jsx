import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Login.css";
import "@fontsource/m-plus-rounded-1c/700.css";

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .email("El formato del correo electrónico no es válido")
    .required("El correo electrónico es requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .matches(/[0-9]/, "Debe contener al menos un número")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Debe contener al menos un carácter especial"
    )
    .required("La contraseña es requerida"),
});

const ErrorMessageStyled = ({ children }) => (
  <div
    style={{
      color: "#ff3333",
      fontSize: "0.85rem",
      marginTop: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    }}
  >
    <i style={{ fontSize: "14px" }}>⚠️</i>
    {children}
  </div>
);

const Login = () => {
  const handleSubmit = (values) => {
    console.log("Form submitted:", values);
  };

  const handleGoogleLogin = () => {
    try {
      const apiUrl = import.meta.env.PROD 
        ? '/api'
        : 'http://localhost:3000';
      
      console.log('Intentando conectar a:', `${apiUrl}/api/auth/google`);
      window.location.href = `${apiUrl}/api/auth/google`;
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="logo-container">
        <h1 className="logo-text">
          <span className="logo-visi">VISI</span>
          <span className="logo-o">⦿</span>
          <span className="logo-n">N</span>
          <span className="logo-verse">VERSE</span>
        </h1>
      </div>

      <div className="login-container">
        <div className="login-card">
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form className="login-form">
                <h2>Login</h2>

                <div className="form-group">
                  <label>Username</label>
                  <Field
                    type="email"
                    name="username"
                    className="form-control"
                    style={
                      errors.username && touched.username
                        ? {
                            borderColor: "#ff3333",
                            boxShadow: "0 0 0 2px rgba(255, 51, 51, 0.2)",
                          }
                        : {}
                    }
                  />
                  <ErrorMessage
                    name="username"
                    component={ErrorMessageStyled}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                    style={
                      errors.password && touched.password
                        ? {
                            borderColor: "#ff3333",
                            boxShadow: "0 0 0 2px rgba(255, 51, 51, 0.2)",
                          }
                        : {}
                    }
                  />
                  <ErrorMessage
                    name="password"
                    component={ErrorMessageStyled}
                  />
                </div>

                <div className="forgot-password">
                  <a href="#">Forgot your password?</a>
                </div>

                <button
                  type="submit"
                  className={`login-button ${isValid && dirty ? "active" : ""}`}
                  disabled={!isValid || !dirty}
                >
                  LOGIN
                </button>

                <div className="social-login">
                  <img
                    src="/google-icon.png"
                    alt="Google"
                    onClick={handleGoogleLogin}
                    style={{ cursor: "pointer" }}
                  />
                  <img src="/facebook-icon.png" alt="Facebook" />
                  <img src="/apple-icon.png" alt="Apple" />
                </div>

                <div className="contact-support">
                  Need an account? Contact support
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;