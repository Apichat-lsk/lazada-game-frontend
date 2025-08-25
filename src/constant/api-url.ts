// const URL = 'http://localhost:8080';
const URL = 'https://53c2e34ed86f.ngrok-free.app';
// const URL = 'http://206.189.147.75:8080';
export const API = {
  REGISTER: `${URL}/api/auth/register`,
  LOGIN: `${URL}/api/auth/login`,
  CHECK_DUPLICATE: `${URL}/api/auth/check-duplicate`,
  CHANGE_PASSWORD: `${URL}/api/auth/change-password`,
  SEND_OTP: `${URL}/api/otp/send`,
  SEND_OTP_AGAIN: `${URL}/api/otp/send-otp-again`,
  VERIFY_OTP: `${URL}/api/otp/verify`,
  GET_OTP: `${URL}/api/otp/get`,
  FORGOT_PASSWORD_VERIFY_OTP: `${URL}/api/otp/verify-otp-forgot-password`,
  RECAPTCHA: `${URL}/api/recaptcha/verify-recaptcha`,
  QUESTIONS: `${URL}/api/question/get-questions`,
  ANSWER: `${URL}/api/question`,
  CHECK_ANSWER: `${URL}/api/question/check-answer-by-id`,
  BOARD: `${URL}/api/board`,
  CHECK_GAME_DATE: `${URL}/api/game/check-game-date`,
  CHECK_LAST_GAME_DATE: `${URL}/api/game/check-play-game`,
  CONTACT: `${URL}/api/contact`,
};
