import { Validator, validateSync, validate } from '../src/yaml-js.reader';

describe('Subject: Validator class', () => {

  it('Scenario 01: If the yaml content is valid, validation returns true and no errors', async () => {
    const file = './tests/resources/valid/config.yml';
    const schema = './tests/resources/valid/schema.yaml';

    const validator = new Validator();
    const result = validator.validateSync(schema, file);
    expect(result.valid).toBeTruthy();
    expect(result.errors).toEqual([]);

    await expect(validate(schema, file)).resolves.toEqual({valid: true, errors: []});
    expect(validateSync(schema, file)).toEqual({valid: true, errors: []});
  }, 120 * 1000);

});
