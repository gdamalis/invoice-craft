# Invoice Generator Documentation

Welcome to the Invoice Generator documentation! This tool is designed to simplify the creation of PDF invoices for contractors and freelancers. By automating the invoice generation process, it allows professionals to focus more on their work and less on administrative tasks.

## Overview

The Invoice Generator utilizes an API from [https://invoice-generator.com/](https://invoice-generator.com/) to dynamically create PDF invoices. This process involves sending invoice details to the API, which then returns a professionally formatted PDF invoice.

### Security and Privacy

**Privacy Assurance:** When using the Invoice Generator API, your data privacy is respected. The information sent to the API is used solely for generating the PDF invoice and is not stored on their servers. For more details on their data handling practices, please refer to the [Invoice Generator API documentation](https://invoice-generator.com/developers).

## Getting Started

To get started with the Invoice Generator, follow these setup instructions:

### Setup Requirements

1. **Install Dependencies:** Run `npm install` to install all required dependencies for the project.
2. **Environment Configuration:** Create a `.env` file for environment variables such as the MongoDB URI and the filename pattern for your invoices. Use the provided `.env.template` as a guide and follow the instructions within it to set up your environment correctly.

### Generating an Invoice

To generate an invoice:

1. **Prepare Invoice Data:** Create an `invoice.json` file based on the provided `invoice-schema.json`. Fill in this file with the details you wish to include in your invoice.
2. **Generate PDF:** Execute `npm run start`. This command triggers a script that generates the PDF invoice and saves the data used for that invoice in a MongoDB database.

## Contribution Guidelines

We welcome contributions and suggestions to improve this tool! If you have ideas or improvements, please submit a pull request with your changes.

## Author

- **Gabriel Damalis**

## Best Practices and Additional Notes

- **Data Validation:** Ensure that the data you input into the `invoice.json` file strictly adheres to the schema defined in `invoice-schema.json`. This will help prevent errors during the invoice generation process.
- **Security:** Keep your `.env` file secure and do not share its contents or include it in your version control system. Use `.gitignore` to exclude it from your repository.
- **Dependency Management:** Regularly update your dependencies to mitigate security vulnerabilities and keep your tool functioning with the latest node packages.
- **Error Handling:** Implement error handling in your script to manage API failures or issues during the PDF generation process. This will improve the tool's reliability and user experience.

By following these practices and guidelines, you can maintain and improve the Invoice Generator tool, making it more robust, secure, and easy to use.
