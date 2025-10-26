import * as bcrypt from 'bcrypt';

export const createPasswordHashed = async (
  password: string,
  ): Promise<string> => {
    const saltOrRounds = 10;

    const passwordHashed = await bcrypt.hash(
      password,
      saltOrRounds,
    );

    return passwordHashed;
  };

  export const validatePassword = async (
    password: string,
    passwordHashed: string,
  ): Promise<boolean> => {
    return bcrypt.compare(password, passwordHashed);
  }