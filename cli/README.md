# @asterai/cli

CLI for building and deploying AsterAI plugins

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@asterai/cli.svg)](https://npmjs.org/package/@asterai/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@asterai/cli.svg)](https://npmjs.org/package/@asterai/cli)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @asterai/cli
$ asterai COMMAND
running command...
$ asterai (--version)
@asterai/cli/0.0.0 linux-x64 node-v20.12.2
$ asterai --help [COMMAND]
USAGE
  $ asterai COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`asterai hello PERSON`](#asterai-hello-person)
- [`asterai hello world`](#asterai-hello-world)
- [`asterai help [COMMAND]`](#asterai-help-command)
- [`asterai plugins`](#asterai-plugins)
- [`asterai plugins add PLUGIN`](#asterai-plugins-add-plugin)
- [`asterai plugins:inspect PLUGIN...`](#asterai-pluginsinspect-plugin)
- [`asterai plugins install PLUGIN`](#asterai-plugins-install-plugin)
- [`asterai plugins link PATH`](#asterai-plugins-link-path)
- [`asterai plugins remove [PLUGIN]`](#asterai-plugins-remove-plugin)
- [`asterai plugins reset`](#asterai-plugins-reset)
- [`asterai plugins uninstall [PLUGIN]`](#asterai-plugins-uninstall-plugin)
- [`asterai plugins unlink [PLUGIN]`](#asterai-plugins-unlink-plugin)
- [`asterai plugins update`](#asterai-plugins-update)

## `asterai hello PERSON`

Say hello

```
USAGE
  $ asterai hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ asterai hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.0.0/src/commands/hello/index.ts)_

## `asterai hello world`

Say hello world

```
USAGE
  $ asterai hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ asterai hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.0.0/src/commands/hello/world.ts)_

## `asterai help [COMMAND]`

Display help for asterai.

```
USAGE
  $ asterai help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for asterai.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.22/src/commands/help.ts)_

## `asterai plugins`

List installed plugins.

```
USAGE
  $ asterai plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ asterai plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.1.3/src/commands/plugins/index.ts)_

## `asterai plugins add PLUGIN`

Installs a plugin into asterai.

```
USAGE
  $ asterai plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into asterai.

  Uses bundled npm executable to install plugins into /home/lorenzo/.local/share/asterai

  Installation of a user-installed plugin will override a core plugin.

  Use the ASTERAI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ASTERAI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ asterai plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ asterai plugins add myplugin

  Install a plugin from a github url.

    $ asterai plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ asterai plugins add someuser/someplugin
```

## `asterai plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ asterai plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ asterai plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.1.3/src/commands/plugins/inspect.ts)_

## `asterai plugins install PLUGIN`

Installs a plugin into asterai.

```
USAGE
  $ asterai plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into asterai.

  Uses bundled npm executable to install plugins into /home/lorenzo/.local/share/asterai

  Installation of a user-installed plugin will override a core plugin.

  Use the ASTERAI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ASTERAI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ asterai plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ asterai plugins install myplugin

  Install a plugin from a github url.

    $ asterai plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ asterai plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.1.3/src/commands/plugins/install.ts)_

## `asterai plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ asterai plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ asterai plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.1.3/src/commands/plugins/link.ts)_

## `asterai plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ asterai plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ asterai plugins unlink
  $ asterai plugins remove

EXAMPLES
  $ asterai plugins remove myplugin
```

## `asterai plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ asterai plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.1.3/src/commands/plugins/reset.ts)_

## `asterai plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ asterai plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ asterai plugins unlink
  $ asterai plugins remove

EXAMPLES
  $ asterai plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.1.3/src/commands/plugins/uninstall.ts)_

## `asterai plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ asterai plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ asterai plugins unlink
  $ asterai plugins remove

EXAMPLES
  $ asterai plugins unlink myplugin
```

## `asterai plugins update`

Update installed plugins.

```
USAGE
  $ asterai plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.1.3/src/commands/plugins/update.ts)_

<!-- commandsstop -->
