import {defineArrayMember, defineField, defineType} from 'sanity'

export const zakonType = defineType({
  name: 'zakon',
  title: 'Zakoni',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(160),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Kratki opis',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(400),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
        }),
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (Rule) => Rule.required().min(2).max(120),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle,
      }
    },
  },
})
