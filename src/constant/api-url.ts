const URL = 'http://localhost:8080';
// const URL = ' https://2fe13db9ec84.ngrok-free.app';
export const API = {
  REGISTER: `${URL}/api/auth/register`,
  LOGIN: `${URL}/api/auth/login`,
  CHANGE_PASSWORD: `${URL}/api/auth/change-password`,
  SEND_OTP: `${URL}/api/otp/send`,
  VERIFY_OTP: `${URL}/api/otp/verify`,
  GET_OTP: `${URL}/api/otp/get`,
  FORGOT_PASSWORD_VERIFY_OTP: `${URL}/api/otp/verify-otp-forgot-password`,
  RECAPTCHA: `${URL}/api/recaptcha/verify-recaptcha`,
  QUESTIONS: `${URL}/api/question`,
  ANSWER: `${URL}/api/question`,
  BOARD: `${URL}/api/board`,
};
