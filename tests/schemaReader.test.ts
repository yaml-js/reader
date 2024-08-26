import { SchemaReader, readSchema, readSchemaSync } from '../src/yaml-js.reader';

describe('Subject: SchemaReader class', () => {

  it('Scenario 01: Is should read a single json schema successfully', async () => {
    const path = './tests/resources/schema.json';
    const expected = {
      $id: "http://example.com/schema.yaml",
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Simple json schema defined using yaml",
      type: "object",
      properties: {
        env: {
          type: "string"
        },
        app: {
          type: "object",
          properties: {
            name: {
              type: "string"
            },
            version: {
              type: "string"
            },
            description: {
              type: "string"
            }
          },
          required: [
            "name",
            "version",
            "description"
          ]
        },
        api: {
          type: "object",
          properties: {
            url: {
              type: "string"
            },
            key: {
              type: "string"
            }
          },
          required: [
            "url",
            "key"
          ]
        }
      },
      required: [
        "app",
        "api"
      ]
    }


    const reader = new SchemaReader();
    const result = await reader.read(path)
    expect(result).toEqual(expected);

    const resultReadSync = readSchemaSync(path)
    expect(resultReadSync).toEqual(expected);

    const resultReadAsync = await readSchema(path)
    expect(resultReadAsync).toEqual(expected);
  });
});
