import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';

export const isTransactionCanceledException = (
  input: unknown
): input is TransactionCanceledException => {
  return (
    typeof input === 'object' &&
    input['name'] === 'TransactionCanceledException'
  );
};
