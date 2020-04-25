
import seedTemplates from './templates';

import path from 'path';
const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);

export default async ({
  db,
}) => {

  const {
    API_SEED_TEMPLATES,
  } = process.env;

  console.log('API_SEED_TEMPLATES', API_SEED_TEMPLATES);


  if (API_SEED_TEMPLATES !== "true") {

    console.warn("API_SEED_TEMPLATES is false. Skip seeding.");

    return false;
  }

  await seedTemplates({
    db,
    seed_dir: `${__dirname}/data/`,
  });
}
