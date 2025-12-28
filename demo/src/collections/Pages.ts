import type { CollectionConfig } from 'payload'

import { iconPickerField } from '@tienngang/payload-icon-picker-field'
import { icons } from '../assets/icons'

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      required: true,
      localized: true,
    },
    iconPickerField({
      name: 'customIcons',
      label: 'Custom Icons',
      icons: icons,
    }),
    {
      name: 'excerpt',
      type: 'text',
      localized: true,
    },
    {
      name: 'date',
      type: 'date',
    },
  ],
}
