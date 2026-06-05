import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
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
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(400),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {
        layout: 'tags',
      },
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
    defineField({
      name: 'allowComments',
      title: 'Dozvoli komentare',
      description: 'Ako je iskljuceno, forma za komentare nece biti prikazana na frontend-u.',
      type: 'boolean',
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'poll',
      title: 'Anketa',
      type: 'object',
      fields: [
        defineField({
          name: 'question',
          title: 'Pitanje',
          type: 'string',
          validation: (Rule) => Rule.required().min(5).max(200),
        }),
        defineField({
          name: 'options',
          title: 'Opcije',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Tekst opcije',
                  type: 'string',
                  validation: (Rule) => Rule.required().min(1).max(120),
                }),
              ],
              preview: {
                select: {
                  title: 'label',
                },
              },
            }),
          ],
          validation: (Rule) => Rule.required().min(2).max(10),
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Image gallery',
      description:
        'Prevuci i pusti vise slika odjednom ili oznaci vise fajlova u file picker-u (Ctrl/Shift) i uploaduj u jednom koraku.',
      type: 'array',
      of: [
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
      options: {
        layout: 'grid',
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'category'}],
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      categories: 'categories',
      media: 'mainImage',
    },
    prepare({title, categories, media}) {
      const categoriesCount = Array.isArray(categories) ? categories.length : 0

      return {
        title,
        subtitle: categoriesCount > 0 ? `${categoriesCount} kategorija` : 'Bez kategorije',
        media,
      }
    },
  },
})
