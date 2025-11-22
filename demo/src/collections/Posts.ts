import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'excerpt',
              type: 'text',
              localized: true,
            },
          ],
          label: 'Content',
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      label: 'Slug',
      required: true,
      localized: true,
    },
  ],
  versions: true,
}