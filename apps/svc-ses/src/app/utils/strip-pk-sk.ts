export const stripPkSk = <T extends { pk: string; sk: string }>(
  input: T
): Omit<T, 'pk' | 'sk'> => {
  const { pk, sk, ...rest } = input;

  return rest;
};
