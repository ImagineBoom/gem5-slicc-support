# Welcome to your VS Code Extension

## What's in the folder

* This folder contains all of the files necessary for your extension.
* `package.json` - this is the manifest file in which you declare your language support and define the location of the grammar file that has been copied into your extension.
* `syntaxes/gem5-slicc.tmLanguage.json` - this is the Text mate grammar file that is used for tokenization.
* `language-configuration.json` - this is the language configuration, defining the tokens that are used for comments and brackets.

* json -> yaml
```bash
npx js-yaml syntaxes/gem5-slicc.tmLanguage.json > syntaxes/gem5-slicc.tmLanguage.yaml
```
* yaml -> json
```bash
npx js-yaml syntaxes/gem5-slicc.tmLanguage.yaml > syntaxes/gem5-slicc.tmLanguage.json
```

## Get up and running straight away

* Make sure the language configuration settings in `language-configuration.json` are accurate.
* Press `F5` to open a new window with your extension loaded.
* Create a new file with a file name suffix matching your language.
* Verify that syntax highlighting works and that the language configuration settings are working.

## Build the extension

```shellscript
npm install
```

```shellscript
npm run compile
```

## Generate Packge
- ref: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

Installation
Make sure you have Node.js installed. Then run:

```bash
npm install -g @vscode/vsce
```

Usage
You can use vsce to easily package and publish your extensions:
```bash
vsce package

# output -> myExtension.vsix generated
```



## Make changes

* You can relaunch the extension from the debug toolbar after making changes to the files listed above.
* You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.

## Add more language features

* To add features such as IntelliSense, hovers and validators check out the VS Code extenders documentation at https://code.visualstudio.com/docs

## Install your extension

* To start using your extension with Visual Studio Code copy it into the `<user home>/.vscode/extensions` folder and restart Code.
* To share your extension with the world, read on https://code.visualstudio.com/docs about publishing an extension.
