# ui-plugin-find-contact

Copyright (C) 2017-2019 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

This package furnishes a single Stripes plugin of type `find-contact`,
which can be included in Stripes modules by means of a `<Pluggable
type="find-contact">` element. See [the *Plugins*
section](https://github.com/folio-org/stripes-core/blob/master/doc/dev-guide.md#plugins)
of the Module Developer's Guide.

## Props

| Name | Type | Description | Required |
--- | --- | --- | --- |
| `addContacts` | func: (contacts) => {} | Callback fired when a user clicks Save&Close button in Modal with contacts selected | Yes |
| `disabled` | boolean | Flag to control `disabled` property of plugin's button, since it's rendered inside the plugin | No |
| `stripes` | object | stripes-core glue object | Yes |
| `searchButtonStyle` | string | optional styling of plugin's button | No |
| `searchLabel` | React.node | optional jsx for plugin's button label | No |
| `dataKey` | string | dataKey passed to stripes/connect when creating the connected Agreements component. | Yes |

This is a [Stripes](https://github.com/folio-org/stripes-core/) UI module to display, filter and select contact persons in ui-organizations app.

## Additional information

See the related [ui-organizations](https://github.com/folio-org/ui-organizations) module. (Consumer)

Other [modules](https://dev.folio.org/source-code/#client-side).

See project [UIORGS](https://issues.folio.org/browse/UIORGS)
at the [FOLIO issue tracker](https://dev.folio.org/guidelines/issue-tracker).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)
