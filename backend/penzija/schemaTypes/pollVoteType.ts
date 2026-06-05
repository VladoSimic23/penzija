import {defineField, defineType} from 'sanity'

export const pollVoteType = defineType({
  name: 'pollVote',
  title: 'Poll vote',
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
      name: 'optionKey',
      title: 'Option key',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'voterHash',
      title: 'Voter hash',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'post.title',
      subtitle: 'optionKey',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Nepoznat post',
        subtitle: subtitle ? `Opcija: ${subtitle}` : 'Bez opcije',
      }
    },
  },
})
