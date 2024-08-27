import { Validator, validate } from '../src/yaml-js.reader';

describe('Subject: Validate Yaml', () => {

  it('Scenario 01: If the yaml content is valid, validation returns true and no errors', async () => {
    const file = './tests/resources/validation/valid.yml';
    const schema = './tests/resources/validation/schema.yaml';

    const validator = new Validator();
    await expect(validator.validate(schema, file)).resolves.toEqual({valid: true, errors: []});

    await expect(validate(schema, file)).resolves.toEqual({valid: true, errors: []});
  });
});
