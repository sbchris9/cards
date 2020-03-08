import { createApp } from './app';

async function main() {
  const app = await createApp();
  const port = 4000;

  app.listen(port, () => {
    console.log(`Server is running. http://localhost:${port}/graphql`);
  });
}

main();
