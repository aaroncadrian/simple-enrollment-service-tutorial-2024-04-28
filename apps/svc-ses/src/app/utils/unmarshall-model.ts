import { stripPkSk } from './strip-pk-sk';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

export const unmarshallModel = <TModel>(
  input: Record<string, AttributeValue>
): TModel => {
  const unmarshalledItem = unmarshall(input) as TModel & {
    pk: string;
    sk: string;
  };

  return stripPkSk(unmarshalledItem) as TModel;
};
