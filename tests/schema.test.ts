import * as fs from 'fs/promises';
import validSchema from './resources/schema.json';

import { TextFileLoader } from '../src/textFileLoader';
import { InvalidSchemaError, SchemaCompiler, SchemaReader, readSchema } from '../src/yaml-js.reader';
import { SimpleTestsServer } from './simpleTestsServer';

describe('Subject: Read Schema', () => {

  let server: SimpleTestsServer;

  beforeAll(() => {
    server = new SimpleTestsServer();
    server.start();

    server.addRoute(["GET"], '/schema.json', (_, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(validSchema);
    });

    server.addRoute(["GET"], '/schema.yaml', async (_, res) => {
      res.setHeader('Content-Type', 'application/yaml');
      const file = await fs.readFile('./tests/resources/schema.yaml');
      res.send(file);
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 500)
    }); // avoid jest open handle error

    server.stop();
  });

  it ('Scenario 01: It throws reading an invalid schema', async () => {
    const path = './tests/resources/schema-invalid.yaml';
    expect(() => readSchema(path)).rejects.toThrow(InvalidSchemaError);
  });

  it('Scenario 02: Is should successfully read a single json schema', async () => {
    const path = './tests/resources/schema.json';
    const loader = new TextFileLoader(process.cwd())
    const reader = new SchemaReader(loader, new SchemaCompiler(loader));
    const result = await reader.read(path)
    expect(result).toEqual(validSchema);

    const resultReadAsync = await readSchema(path)
    expect(resultReadAsync).toEqual(validSchema);
  });

  it('Scenario 03: Is should successfully read a json schema from an uri', async () => {
    const resultReadAsync = await readSchema(`http://localhost:${server.port}/schema.json`)
    expect(resultReadAsync).toEqual(validSchema);
  });

  it('Scenario 04: Is should successfully read a yaml schema from an uri', async () => {
    const resultReadAsync = await readSchema(`http://localhost:${server.port}/schema.yaml`)
    const yamlSchema = {...validSchema, $id: "org.yaml-js.schemas.tests.base-yaml"};
    expect(resultReadAsync).toEqual(yamlSchema);
  });
});
