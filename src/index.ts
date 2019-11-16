import { loadConfig } from "./services/config";
import { fetchData } from "./services/providers";

const main = async ():Promise<IRepository[]> => {
  const config = await loadConfig();

  return fetchData(config);
};

main()
    .then(console.log)
    .catch(console.error);