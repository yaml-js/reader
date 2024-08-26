import { FileNotFoundError, Reader, read, readMultiple, readMultipleSync, readSync } from '../src/yaml-js.reader';

describe('Subject: Reader class', () => {

  it('Scenario 01: It throws and exception if file does not exist and falg is set to true', async () => {
    const path = './tests/resources/non-existent.yaml';

    const reader = new Reader();
    await expect(reader.read([{path, options: {throwIfNotFound: true}}])).rejects.toThrow(FileNotFoundError);

    expect(() => readSync(path, {throwIfNotFound: true})).toThrow(FileNotFoundError);
    await expect(() => read(path, {throwIfNotFound: true})).rejects.toThrow(FileNotFoundError);
  });

  it('Scenario 02: It returns empty object if file does not exist and falg is set to false', async () => {
    const path = './tests/resources/non-existent.yaml';

    const expected = {}
    const reader = new Reader();
    const result = await reader.read([{path}])
    expect(result).toEqual(expected);

    const resultReadSync = readSync(path)
    expect(resultReadSync).toEqual(expected);

    const resultReadAsync = await read(path)
    expect(resultReadAsync).toEqual(expected);
  });

  it('Scenario 03: Is should read a single file successfully', async () => {
    const path = './tests/resources/config.yaml';

    const expected = {
      app: {
        name: "my-app",
        version: "1.0.0",
        description: "My App"
      },
      api: {
        url: "http://api.my-app.com",
        key: "${API_KEY}"
      }
    }

    const reader = new Reader();
    const result = await reader.read([{path}])
    expect(result).toEqual(expected);

    const resultReadSync = readSync(path)
    expect(resultReadSync).toEqual(expected);

    const resultReadAsync = await read(path)
    expect(resultReadAsync).toEqual(expected);
  });

  it('Scenario 04: If I pass multiple files content from the last overides the first', async () => {
    const path = './tests/resources/config.yml';
    const pathOveride = './tests/resources/config.overide.yml';

    const expected = {
      env: "STG",
      app: {
        name: "my-app",
        version: "1.0.0",
        description: "My App"
      },
      api: {
        url: "http://override-api.my-app.com",
        key: "${API_KEY}"
      }
    }

    const resultReadSync = readMultipleSync([{path}, {path: pathOveride}])
    expect(resultReadSync).toEqual(expected);

    const resultReadAsync = await readMultiple([{path}, {path: pathOveride}])
    expect(resultReadAsync).toEqual(expected);
  });

  it('Scenario 05: Environment variables are replaced on the file content', async () => {
    const path = './tests/resources/config.yml';
    process.env.API_KEY = "THIS IS THE API KEY";

    const expected = {
      app: {
        name: "my-app",
        version: "1.0.0",
        description: "My App"
      },
      api: {
        url: "http://api.my-app.com",
        key: "THIS IS THE API KEY"
      }
    }

    const resultReadSync = readSync(path)
    expect(resultReadSync).toEqual(expected);

    const resultReadAsync = await read(path)
    expect(resultReadAsync).toEqual(expected);
  });

  it('Scenario 06: If I disable environment variables replacement they are not replaced on the the file content', async () => {
    const path = './tests/resources/config.yml';
    process.env.API_KEY = "THIS IS THE API KEY";

    const expected = {
      app: {
        name: "my-app",
        version: "1.0.0",
        description: "My App"
      },
      api: {
        url: "http://api.my-app.com",
        key: "${API_KEY}"
      }
    }

    const resultReadSync = readSync(path, {replaceEnvVariables: false})
    expect(resultReadSync).toEqual(expected);

    const resultReadAsync = await read(path, {replaceEnvVariables: false})
    expect(resultReadAsync).toEqual(expected);
  });
});
