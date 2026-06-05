import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(60),
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
      name: 'color',
      title: 'Color',
      description: 'Choose a category color for frontend styling.',
      type: 'string',
      options: {
        list: [
          {title: 'Red', value: '#EF4444'},
          {title: 'Orange', value: '#F97316'},
          {title: 'Yellow', value: '#EAB308'},
          {title: 'Green', value: '#22C55E'},
          {title: 'Blue', value: '#3B82F6'},
          {title: 'Indigo', value: '#6366F1'},
          {title: 'Pink', value: '#EC4899'},
          {title: 'Gray', value: '#6B7280'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) =>
        Rule.required().regex(/^#([A-Fa-f0-9]{6})$/, {
          name: 'hex color',
          invert: false,
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'color',
    },
  },
})
