# InvoiceCraft Documentation

Welcome to the InvoiceCraft documentation! This tool is designed to simplify the creation of PDF invoices for contractors and freelancers. By automating the invoice generation process, it allows professionals to focus more on their work and less on administrative tasks.

## Overview

The InvoiceCraft utilizes the Invoice Generator API from [https://invoice-generator.com/](https://invoice-generator.com/) to dynamically create PDF invoices. This process involves sending invoice details to the API, which then returns a professionally formatted PDF invoice.

### Security and Privacy

**Privacy Assurance:** When using the Invoice Generator API, your data privacy is respected. The information sent to the API is used solely for generating the PDF invoice and is not stored on their servers. For more details on their data handling practices, please refer to the [Invoice Generator API documentation](https://invoice-generator.com/developers).

## Getting Started

To get started with the InvoiceCraft, follow these setup instructions:

### Setup Requirements

1. **Install Dependencies:** Run `pnpm install` to install all required dependencies for the project.
2. **Environment Configuration:** Copy `.env.template` to `.env` and fill it in. The variables are:

| Variable | Required | Purpose |
|---|---|---|
| `INVOICE_GENERATOR_API_URL` | yes | Host the invoice payload is POSTed to |
| `INVOICE_GENERATOR_API_KEY` | yes | Bearer token for that API |
| `FILE_NAME_FORMAT` | yes | Output filename; `{{number}}` is replaced with the invoice number |
| `OUTPUT_DIR` | no | Directory to write the PDF into. Created if missing, and a leading `~` is expanded. Defaults to the current working directory. |
| `MONGODB_URI` | only for `--save` | Cluster the invoice payload is archived to |

### Generating an Invoice

To generate an invoice:

1. **Prepare Invoice Data:** Create an `invoice.json` file based on the provided `invoice-schema.json`. Fill in this file with the details you wish to include in your invoice.
2. **Generate PDF:** Execute `pnpm generate`. This writes the PDF to `OUTPUT_DIR` (or the current directory) and prints the absolute path it used. Use `pnpm generate-save` instead to additionally archive the invoice data to MongoDB — that requires `MONGODB_URI`, and the machine's public egress IP must be allowlisted on the cluster.

Keep the `invoice.json` you used. It is gitignored, so archive it alongside the generated PDF if you want the invoice to be reproducible later.

## Contribution Guidelines

We welcome contributions and suggestions to improve this tool! If you have ideas or improvements, please submit a pull request with your changes.

## Author

- **Gabriel Damalis**

## Best Practices and Additional Notes

- **Data Validation:** Ensure that the data you input into the `invoice.json` file strictly adheres to the schema defined in `invoice-schema.json`. This will help prevent errors during the invoice generation process.
- **Security:** Keep your `.env` file secure and do not share its contents or include it in your version control system. Use `.gitignore` to exclude it from your repository.
- **Dependency Management:** Regularly update your dependencies to mitigate security vulnerabilities and keep your tool functioning with the latest node packages.
- **Error Handling:** Implement error handling in your script to manage API failures or issues during the PDF generation process. This will improve the tool's reliability and user experience.

By following these practices and guidelines, you can maintain and improve the InvoiceCraft tool, making it more robust, secure, and easy to use.
