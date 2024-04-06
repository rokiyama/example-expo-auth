import { Auth } from 'aws-amplify';

type ConfirmSignUpParameters = {
  username: string;
  code: string;
};

export async function confirmSignUp({
  username,
  code,
}: ConfirmSignUpParameters) {
  try {
    await Auth.confirmSignUp(username, code);
  } catch (error) {
    console.log('error confirming sign up', error);
  }
}
