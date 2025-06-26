# Veeva Rep-Triggered Email (RTE) Token Linter CLI

[![NPM Version](https://img.shields.io/npm/v/veeva-rte-linter-cli.svg?style=flat)](https://github.com/Pr0xicide/veeva-rte-linter-cli) [![NPM Downloads](https://img.shields.io/npm/dt/veeva-rte-linter-cli.svg?style=flat)](https://www.npmjs.com/package/veeva-rte-linter-cli) [![Issues](https://img.shields.io/github/issues-raw/Pr0xicide/veeva-rte-linter-cli.svg?maxAge=25000)](https://github.com/Pr0xicide/veeva-rte-linter-cli/issues)

A code linter for the development Veeva RTE HTML files. This linter is designed to review only [Veeva's approved email tokens](https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/ManageCreateContent/CreatingContent/ConfigTokens.htm). Either syntax errors or using tokens in inappropriate file types.

## Installation

```bash
npm install veeva-rte-linter-cli -g
```

## Usage

To start linting run the following command in your terminal after installing:

```bash
lint-veeva-rte {PATH-TO-HTML-FILE} {FILE-TYPE}
```

### Path to HTML File

Path leading to the HTML file to lint.

### File Type

**Case-sensitive**, use **one** of the following options below.

- `et` for [email templates](https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/InitialConfig/Components.htm#EmailTemplates)
- `et` for [email fragments](https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/InitialConfig/Components.htm#EmailFragments)
- `tf` for [template fragments](https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/InitialConfig/Components.htm#TemplateFragments)

## Author

Jayvin Duong
