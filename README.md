# asterai-sdk
Monorepo for AsterAI client libraries, interfaces and tooling.

| Version | Package name    | Purpose                           |
|---------|-----------------|-----------------------------------|
| N/A     | @asterai-io/cli | Deploy AsterAI Plugins            |
| N/A     | @asterai-io/sdk | Provide AsterAI Plugin interfaces |

# Documentation
AsterAI is a plugin-based cloud infrastructure provider for AI applications.
Using AsterAI's open-source tooling, developers can write simple
software packages (Plugins) and compose them into a powerful AI application. 

## Plugins and libraries
An AsterAI Plugin contains at least one entry point, called a hook, which can
hook into the request lifecycle.
The main hook, `processRequest`, handles incoming user requests
and may output response data.

The AsterAI Plugin system allows for runtime calling of other plugins through
a JSON-RPC-like interface.
This allows for WebAssembly Plugins to communicate with each other at runtime,
independently of what language they were written in.

Additionally, open source plugins can also be used as libraries and imported
via code from other plugins.
Note that this approach is a "static" way of using plugins as libraries, and is
not language agnostic (an AssemblyScript library cannot be imported from a
plugin written in Rust, for example).

## Plugin trigger modes
A Plugin trigger mode decides when a plugin hook is triggered.
There are different trigger modes for plugins:

| Mode             | Description                                          |
|------------------|------------------------------------------------------|
| Every Message    | Triggered on every message                           |
| Similarity       | Triggered on message similarity with plugin metadata |
| LLM + Similarity | Triggered on similarity and extra LLM check          |

With the Every Message mode, the plugin hook is called for each incoming user message.
This allows for more control as plugins can decide for themselves whether
they should run or not.

With the Similarity mode, the App will only run the plugin if the incoming user
message is above the vector DB similarity threshold of the plugin metadata
(name, description, keywords, etc.) -- this is the most common check as it is
reliable and fast.

The LLM + Similarity mode, the App will do the similarity check and also
query an LLM if the plugin should be executed in the current context.
This is a good option for plugins that trigger important or slow actions.
