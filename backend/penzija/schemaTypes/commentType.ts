import {defineField, defineType} from 'sanity'

export const commentType = defineType({
  name: 'comment',
  title: 'Comments',
  type: 'document',
  fields: [
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{type: 'post'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Ime',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: 'message',
      title: 'Komentar',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required().min(2).max(1500),
    }),
  ],
  orderings: [
    {
      title: 'Najnoviji prvo',
      name: 'createdAtDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
    {
      title: 'Najstariji prvo',
      name: 'createdAtAsc',
      by: [{field: '_createdAt', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'post.title',
      createdAt: '_createdAt',
    },
    prepare({title, subtitle, createdAt}) {
      const dateLabel =
        typeof createdAt === 'string' ? new Date(createdAt).toLocaleString('hr-HR') : ''

      return {
        title: title || 'Bez imena',
        subtitle: subtitle ? `${subtitle} • ${dateLabel}` : dateLabel,
      }
    },
  },
})
