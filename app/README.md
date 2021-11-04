# Application README

## Window messages

There are two types of message that can be sent to the window that will be interpreted by the Creator, `library::add` and `data-dictionary::initialize`.

### Add Library

The `library::add` type should add a component library that exists as one of the options in the Creator application.

Example:
```json
{
    "type": "library::add",
    "libraryId": "fast-components"
}
```

The currently available libraries are:

- (default) Fluent UI components - `"fluent-ui-components"`
- FAST components - `"fast-components"`

### Initialize data dictionary

The `data-dictionary::initialize` type should initialize a new data dictionary with a corresponding schema dictionary.

Example:
```json
{
    "type": "data-dictionary::initialize",
    "dataDictionary": [
        {
            "root": {
                "schemaId": "my-component",
                "data": {}
            }
        },
        "root"
    ],
    "schemaDictionary": {
        "my-component": {
            "$id": "my-component",
            "id": "my-component",
            "mapsToTagName": "my-component",
            "type": "object",
            "properties": {}
        }
    }
}
```