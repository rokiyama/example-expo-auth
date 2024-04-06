import { Auth } from 'aws-amplify';

type SignUpParameters = {
  username: string;
  password: string;
  email: string;
};

export async function signUp({ username, password, email }: SignUpParameters) {
  try {
    const { user } = await Auth.signUp({
      username,
      password,
      attributes: {
        email,
      },
      autoSignIn: {
        // optional - enables auto sign in after user is confirmed
        enabled: true,
      },
    });
    console.log(user);
  } catch (error) {
    console.log('error signing up:', error);
  }
}
