import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

export const authorizationToLoginPayload = (
  authoziration: string,

): LoginPayload | undefined => {
  const authorizationSplited = authoziration.split('.');

  if (authorizationSplited.length < 3 || !authorizationSplited[1]){
    return undefined;
  }

  return JSON.parse(
    Buffer.from(authorizationSplited[1], 'base64').toString('ascii'),
  )
}