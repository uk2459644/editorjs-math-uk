
# Mathk

Provides Block tool for mathmatical  content for the Editor.js. Tool uses Editor.js pasted patterns handling and 
converts them to mathmatical formulas and equations using mathlive.

## Installation

Install editorjs-math-uk with npm

```bash
  npm install editorjs-math-uk
``` 
Or Install editorjs-math-uk with yarn
```bash
yarn add editorjs-math-uk
```
Iclude module at your application
```

## Usage/Examples

```javascript

import Mathk from 'editorjs-math-uk'

```
Add a new Tool to the tools property of the Editor.js initial config.
```javascript

var editorjs=EditorJS({
    ...
    tools:{
        mathk:{
            class:Mathk,
        }
    }
    ...
});
```



## Inline Toolbar

Editor.js provides useful inline toolbar.
You can allow it`s usage in the Mathk Tool caption by providing 
inlineToolbar: true.



```javascript
 var editor = EditorJS({
  ...

  tools: {
    ...
    mathk: {
      class: Mathk,
      inlineToolbar: true
    },
  },

  ...
});
```

## Output data 

```json
{
    "type":"mathk",
    "data": {
                type: 'primary',
                message: '',x=\frac{\pi}{2}\sqrt{e=mc^2}
         }
}

