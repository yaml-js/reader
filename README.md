# YAML Reader

![NPM License](https://img.shields.io/npm/l/%40yaml-js%2Freader)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/yaml-js/reader/build.yml)
![Sonar Quality Gate](https://img.shields.io/sonar/quality_gate/org.yaml-js.reader?server=https%3A%2F%2Fsonarcloud.io)
![Sonar Tech Debt](https://img.shields.io/sonar/tech_debt/org.yaml-js.reader?server=https%3A%2F%2Fsonarcloud.io)
![Sonar Coverage](https://img.shields.io/sonar/coverage/org.yaml-js.reader?server=https%3A%2F%2Fsonarcloud.io)
[![Known Vulnerabilities](https://snyk.io/test/github/yaml-js/reader/badge.svg)](https://snyk.io/test/github/yaml-js/reader/)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/yaml-js/reader)

This package provides a simple and flexible utility for reading YAML files in both TypeScript and JavaScript projects. This package focuses on providing a robust API for file reading and schema validation operations, abstracting the underlying implementation details.

## Key Features

- **YAML File Reading**: Supports reading YAML files, making them easily accessible in your projects.
- **Schema Validation**: Integrates schema validation to ensure that the contents of your YAML files meet specified criteria.
- **API Abstraction**: The package abstracts the actual file reading and schema validation operations, isolating dependencies and allowing for future flexibility.
- **TypeScript and JavaScript Support**: Fully compatible with both TypeScript and JavaScript, providing type safety and ease of use.


## Why Use Reader?

The **Reader** package is designed to serve as a foundational utility for other YAML-JS projects. It provides a standardized API for YAML file reading and validation, which can be extended or modified as needed without impacting the projects that rely on it. This isolation of dependencies allows for greater flexibility in managing and updating the underlying libraries without breaking changes in dependent projects.

## Installation
To install the **Reader**, you can use npm or yarn:

```bash
npm install --save-dev @yaml-js/reader
or
yarn add -D @yaml-js/reader
```

## Usage
Here is a basic example of how to use the **Reader** package in your project::

```javascript
import { read, validate } from '@yaml-js/reader';

// Read a YAML file
const data = await read('./config.yaml');

// Validate the YAML data against a schema
const isValid = validate(data, schema);

if (isValid) {
    console.log('YAML file is valid and ready to use');
} else {
    console.error('YAML file does not conform to the schema');
}
```


### API Overview

- readFile(filePath: string): Promise<Record<string, any>>: Reads the specified YAML file and returns its contents as a JavaScript object.
- validateSchema(data: object, schema: object): boolean: Validates the provided data against the specified schema, returning true if the data conforms, and false otherwise.

### Customization and Extension

The Reader package does not implement the actual YAML reading or schema validation itself.

## Contributing

We welcome contributions to the Vite YAML Plugin! To get started:

1. Fork the repository.
2. Clone your fork: `git clone https://github.com/yaml-js/vite.git`
3. Create a new branch: `git checkout -b feature-name`
4. Make your changes.
5. Ensure your commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
6. Verify if the continuous integration tasks will succeed before committing your code changes by running:
   ```bash
   yarn pre-commit
   ```
7. Commit your changes: git commit -m 'feat: add new feature'
8. Push to the branch: git push origin feature-name
9. Open a pull request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests (note that code coverage minimum threshold is set to 80%).

## License
This project is licensed under the MIT License. See the [LICENSE](/LICENSE) file for more information.

## Acknowledgements
* [Vite](https://vitejs.dev/) - The blazing fast frontend tooling.
* [YAML](https://yaml.org/) - A human-friendly data serialization standard.
* [yaml library](github.com/eemeli/yaml) - This fantastic library made our job easier by not having to build a YAML parser

## Contacts for assistance
- [@pedromvgomes](https://github.com/pedromvgomes) - **Pedro Gomes**, Project Founder


If you have any questions, suggestions, or feedback, feel free to open an issue.
