# Payload Icon Picker Field

[![NPM](https://img.shields.io/npm/v/@innovixx/payload-icon-picker-field)](https://www.npmjs.com/package/@innovixx/payload-icon-picker-field)

A field for [Payload](https://github.com/payloadcms/payload) which implements a robust icon picker which can be used with react-icons or custom svg icons.

![payload-icon-picker-field-screenshot.png](https://github.com/tienngang/payload-icon-picker-field/blob/master/screenshots/payload-icon-picker-field-screenshot.png?raw=true)

Core features:

  - Compatible with Payload v3
  - Support for both react-icons and custom SVG icons
  - Support for function-based icons
  - Case-insensitive icon search
  - Consistent icon sizing
  - Improved component structure
  - Limited to display max 140 icons for better performance
  - Visual preview of icons directly in the field editor

## Installation

```bash
  yarn add @innovixx/payload-icon-picker-field
  # OR
  npm i @innovixx/payload-icon-picker-field
```

## Basic Usage

```ts
import { iconPickerField } from '@innovixx/payload-icon-picker-field'
import type { CollectionConfig } from 'payload/types'
import faIconsMap from '@/data/fa-icons.json'

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    iconPickerField({
      name: 'customIcons',
      label: 'Custom Icons',
      icons: {
        house: {
          icon: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"...',
          group: 'Basic'
        },
        user: {
          icon: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"...',
          group: 'User'
        },
        check: {
          icon: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"...',
          group: 'Actions'
        }
      },
    }),
    iconPickerField({
      name: 'icon',
      label: 'Icon',
      icons: faIconsMap,
    })
  ],
}

export default Pages

```

## Development

To actively develop or debug this plugin you can either work directly within the demo directory of this repo, or link your own project.

1. #### Internal Demo

   This repo includes a fully working, self-seeding instance of Payload that installs the plugin directly from the source code. This is the easiest way to get started. To spin up this demo, follow these steps:

   1. First clone the repo
   1. Then, `cd YOUR_PLUGIN_REPO && yarn && cd demo && yarn && yarn cleanDev`
   1. Now open `http://localhost:3000/admin` in your browser
   1. Enter username `admin@innovixx.co.uk` and password `Pa$$w0rd!`

   That's it! Changes made in `./src` will be reflected in your demo. Keep in mind that the demo database is automatically seeded on every startup, any changes you make to the data get destroyed each time you reboot the app.

1. #### Linked Project

   You can alternatively link your own project to the source code:

   1. First clone the repo
   1. Then, `cd YOUR_PLUGIN_REPO && yarn && cd demo && cp env.example .env && yarn && yarn dev`
   1. Now `cd` back into your own project and run, `yarn link @innovixx/payload-icon-picker-field`
   1. If this plugin using React in any way, continue to the next step. Otherwise skip to step 7.
   1. From your own project, `cd node_modules/react && yarn link && cd ../react-dom && yarn link && cd ../../`
   1. Then, `cd YOUR_PLUGIN_REPO && yarn link react react-dom`

   All set! You can now boot up your own project as normal, and your local copy of the plugin source code will be used. Keep in mind that changes to the source code require a rebuild, `yarn build`.

   You might also need to alias these modules in your Webpack config. To do this, open your project's Payload config and add the following:

   ```js
   import { buildConfig } from "payload/config";

   export default buildConfig({
     admin: {
       webpack: (config) => ({
         ...config,
         resolve: {
           ...config.resolve,
           alias: {
             ...config.resolve.alias,
             react: path.join(__dirname, "../node_modules/react"),
             "react-dom": path.join(__dirname, "../node_modules/react-dom"),
             payload: path.join(__dirname, "../node_modules/payload"),
             "@innovixx/payload-icon-picker-field": path.join(
               __dirname,
               "../../payload/payload-plugin-boilerplate/src"
             ),
           },
         },
       }),
     },
   });
   ```
