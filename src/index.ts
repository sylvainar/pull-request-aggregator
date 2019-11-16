import * as Github from './backends/Github';
import * as Gitlab from './backends/Gitlab';
import config from "./../.config.js";

Gitlab
    .getPullRequests(config.repositories[1])
    .then(console.log)
    .catch(console.error);