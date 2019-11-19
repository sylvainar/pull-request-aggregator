import superagent from 'superagent';

export const makeDefaultAgent = () => {
  const agent = superagent.agent();

  return agent;
};
