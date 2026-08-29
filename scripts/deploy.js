const { cp, mkdir, readdir, rm, writeFile } = require("node:fs/promises");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "..");
const buildsDirectory = path.resolve(repositoryRoot, "../CaveDiver/builds");
const outputDirectory = path.join(repositoryRoot, "docs");

async function deploy() {
  const entries = await readdir(buildsDirectory, { withFileTypes: true });
  const builds = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const latestBuild = builds.at(-1);
  if (!latestBuild) {
    throw new Error(`No builds found in ${buildsDirectory}`);
  }

  await rm(outputDirectory, { force: true, recursive: true });
  await mkdir(outputDirectory, { recursive: true });
  await cp(path.join(buildsDirectory, latestBuild), outputDirectory, {
    recursive: true,
  });
  await writeFile(path.join(outputDirectory, ".nojekyll"), "");

  console.log(`Deployed CaveDiver build ${latestBuild} to docs/`);
}

deploy().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
