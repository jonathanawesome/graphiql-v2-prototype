import { DocumentNode, parse } from 'graphql';

export const parseQuery = (queryText: string): DocumentNode | null | Error => {
  try {
    if (!queryText.trim()) {
      return null;
    }

    return parse(queryText, { noLocation: true });
  } catch (err) {
    return err as Error;
  }
};
