import { FileNotFoundError, Reader, read, readMultiple } from '../src/yaml-js.reader';
import { InvalidYamlContentError } from '../src/errors';

describe('Subject: Read Yaml', () => {

  it('Scenario 01: It throws and exception if file does not exist and falg is set to true', async () => {
    const path = './tests/resources/non-existent.yaml';

    const reader = new Reader();
    await expect(reader.read([path], {throwIfNotFound: true})).rejects.toThrow(FileNotFoundError);
    await expect(() => read(path, {throwIfNotFound: true})).rejects.toThrow(FileNotFoundError);
  });

  it('Scenario 02: It returns empty object if file does not exist and falg is set to false', async () => {
    const path = './tests/resources/non-existent.yaml';

    const expected = {}
    const reader = new Reader();
    const result = await reader.read([path])
    expect(result).toEqual(expected);

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
    const result = await reader.read([path])
    expect(result).toEqual(expected);

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

    const resultReadAsync = await readMultiple([path, pathOveride])
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

    expect(await read(path, {replaceEnvVariables: false})).toEqual(expected);
  });


  it('Scenario 07: If the file links to a schema, the reader validates the content and throws if it is not valid', async () => {
    const valid = './tests/resources/validation/valid.yml';
    const invalid = './tests/resources/validation/invalid.yml';

    expect(read(valid, {validate: true})).resolves.toBeDefined();
    expect(read(invalid, {validate: true})).rejects.toThrow(InvalidYamlContentError);
  });
});
