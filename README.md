# Documentation - Ruter AS

## Introduction
Welcome to Ruters documentation site on Github. This site is intended for PTOs that would like to integrate with Ruters IT-systems.  

The documentation describes the purpose of our over-the-air (OTA) messages, as well as how the messages are to be constructed. 
You will find example messages, json-schemas and tips on how to setup your test environments.

The documentation site is best viewed in your browser by visiting: [https://ruterno.github.io](https://ruterno.github.io) 

## Reporting an issue 

This site is a work in progress, and there might be incomplete information present. If you discover an error or wish there was additional information on a topic,
 please raise an issue here: [Report issue](https://github.com/RuterNo/ruterno.github.io/issues)  
 
## Working on the documentation

This site has been created using [Docsify](https://docsify.js.org/). Please see the 
[quickstart](https://docsify.js.org/#/quickstart) on how to modify on the content.

### Converting to pdf

Make sure you have `nodejs` installed:
 `npm run install && npm run convert`

This will create `pdf/readme.pdf`

#### Configure pdf settings
Configuring pdf is done in `.docsifytopdfrc.js`
Consult [doc](https://www.npmjs.com/package/docsify-pdf-converter) for further documentation.
