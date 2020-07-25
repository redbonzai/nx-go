import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('application e2e', () => {
  it('should create application', async (done) => {
    const plugin = uniq('app');
    ensureNxProject('@nx-go/nx-go', 'dist/packages/nx-go');
    await runNxCommandAsync(`generate @nx-go/nx-go:application ${plugin}`);

    const resultBuild = await runNxCommandAsync(`build ${plugin}`);
    expect(resultBuild.stdout).toContain(`Executing command: go build`);

    // const resultLint = await runNxCommandAsync(`lint ${plugin}`);
    // expect(resultLint.stdout).toContain(`Executing command: go fmt`);

    const resultServe = await runNxCommandAsync(`serve ${plugin}`);
    expect(resultServe.stdout).toContain(`Executing command: go run`);

    // const resultTest = await runNxCommandAsync(`test ${plugin}`);
    // expect(resultTest.stdout).toContain(`Executing command: go test`);

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('nx-go');
      ensureNxProject('@nx-go/nx-go', 'dist/packages/nx-go');
      await runNxCommandAsync(
        `generate @nx-go/nx-go:application ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/src/main.go`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('nx-go');
      ensureNxProject('@nx-go/nx-go', 'dist/packages/nx-go');
      await runNxCommandAsync(
        `generate @nx-go/nx-go:application ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});