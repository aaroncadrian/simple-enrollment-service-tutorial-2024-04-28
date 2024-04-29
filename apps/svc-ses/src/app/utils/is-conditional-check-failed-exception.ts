import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';

export const isConditionalCheckFailedException = (
  input: unknown
): input is ConditionalCheckFailedException => {
  return (
    typeof input === 'object' &&
    input['name'] === 'ConditionalCheckFailedException'
  );
};
