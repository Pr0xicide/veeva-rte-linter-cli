# Veeva Rep-Triggered Email (RTE) Linter CLI

[![NPM Version](https://img.shields.io/npm/v/veeva-rte-linter-cli.svg?style=flat)](https://github.com/Pr0xicide/veeva-rte-linter-cli) [![NPM Downloads](https://img.shields.io/npm/dt/veeva-rte-linter-cli.svg?style=flat)](https://www.npmjs.com/package/veeva-rte-linter-cli) [![Issues](https://img.shields.io/github/issues-raw/Pr0xicide/veeva-rte-linter-cli.svg?maxAge=25000)](https://github.com/Pr0xicide/veeva-rte-linter-cli/issues)

Veeva RTE linter for the development RTE HTML files. This is to catch as many issues with the HTML source code before deploying to Veeva Vault Promomats.

## Installation

```bash
npm install veeva-rte-linter-cli -g
```

## Usage

To start linting run the following command in your terminal after installing:

```bash
lint-veeva-rte {FILE-TYPE} {PATH-TO-HTML-FILE}
```

### File type

<span style="color: red; font-weight: bold;">Case-sensitive</span>. Use one of the following options below.

- `et` for [email templates](https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/InitialConfig/Components.htm#EmailTemplates)
- `et` for [email fragments](https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/InitialConfig/Components.htm#EmailFragments)
- `tf` for [template fragments](https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/InitialConfig/Components.htm#TemplateFragments)

### Path to HTML File

Directory leading to the HTML file to lint.

## Additional Resources

- [Veeva Approved Email Configuration Tokens](https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/ManageCreateContent/CreatingContent/ConfigTokens.htm)

## Author

Jayvin Duong
