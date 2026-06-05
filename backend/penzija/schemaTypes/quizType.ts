import {defineArrayMember, defineField, defineType} from 'sanity'

export const quizType = defineType({
  name: 'quiz',
  title: 'Kviz',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Naslov kviza',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(160),
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
      name: 'description',
      title: 'Kratki opis',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(10).max(400),
    }),
    defineField({
      name: 'coverImage',
      title: 'Naslovna slika kviza',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt tekst',
          type: 'string',
          validation: (Rule) => Rule.required().min(2).max(120),
        }),
      ],
    }),
    defineField({
      name: 'questions',
      title: 'Pitanja',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'quizQuestion',
          title: 'Pitanje',
          fields: [
            defineField({
              name: 'questionText',
              title: 'Tekst pitanja',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'image',
              title: 'Slika pitanja',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt tekst',
                  type: 'string',
                  validation: (Rule) => Rule.required().min(2).max(120),
                }),
              ],
            }),
            defineField({
              name: 'answers',
              title: 'Odgovori',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'quizAnswer',
                  title: 'Odgovor',
                  fields: [
                    defineField({
                      name: 'answerText',
                      title: 'Tekst odgovora',
                      type: 'string',
                    }),
                    defineField({
                      name: 'image',
                      title: 'Slika odgovora',
                      type: 'image',
                      options: {
                        hotspot: true,
                      },
                      fields: [
                        defineField({
                          name: 'alt',
                          title: 'Alt tekst',
                          type: 'string',
                          validation: (Rule) => Rule.required().min(2).max(120),
                        }),
                      ],
                    }),
                    defineField({
                      name: 'isCorrect',
                      title: 'Tačan odgovor',
                      type: 'boolean',
                      initialValue: false,
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  validation: (Rule) =>
                    Rule.custom((value) => {
                      if (!value || typeof value !== 'object') {
                        return 'Odgovor mora imati tekst ili sliku.'
                      }

                      const answerText =
                        typeof value.answerText === 'string' ? value.answerText.trim() : ''
                      const hasImage = Boolean(
                        (value as {image?: {asset?: {_ref?: string}}}).image?.asset,
                      )

                      return answerText.length > 0 || hasImage
                        ? true
                        : 'Odgovor mora imati tekst ili sliku.'
                    }),
                  preview: {
                    select: {
                      title: 'answerText',
                      media: 'image',
                      isCorrect: 'isCorrect',
                    },
                    prepare({title, media, isCorrect}) {
                      return {
                        title: title || '(Odgovor bez teksta)',
                        subtitle: isCorrect ? 'Tačan odgovor' : 'Netačan odgovor',
                        media,
                      }
                    },
                  },
                }),
              ],
              validation: (Rule) =>
                Rule.required()
                  .min(4)
                  .max(4)
                  .custom((answers) => {
                    if (!Array.isArray(answers)) {
                      return 'Dodaj tačno 4 odgovora.'
                    }

                    const correctAnswers = answers.filter((answer) => answer?.isCorrect === true)

                    return correctAnswers.length === 1
                      ? true
                      : 'Tačno jedan odgovor mora biti označen kao tačan.'
                  }),
            }),
            defineField({
              name: 'explanation',
              title: 'Objašnjenje (opcionalno)',
              type: 'text',
              rows: 3,
            }),
          ],
          validation: (Rule) =>
            Rule.custom((value) => {
              if (!value || typeof value !== 'object') {
                return 'Pitanje mora imati tekst ili sliku.'
              }

              const questionText =
                typeof value.questionText === 'string' ? value.questionText.trim() : ''
              const hasImage = Boolean((value as {image?: {asset?: {_ref?: string}}}).image?.asset)

              return questionText.length > 0 || hasImage
                ? true
                : 'Pitanje mora imati tekst ili sliku.'
            }),
          preview: {
            select: {
              title: 'questionText',
              media: 'image',
              answers: 'answers',
            },
            prepare({title, media, answers}) {
              const answersCount = Array.isArray(answers) ? answers.length : 0

              return {
                title: title || '(Pitanje bez teksta)',
                subtitle: `${answersCount} odgovora`,
                media,
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      questions: 'questions',
      media: 'coverImage',
    },
    prepare({title, questions, media}) {
      const questionCount = Array.isArray(questions) ? questions.length : 0

      return {
        title,
        subtitle: `${questionCount} pitanja`,
        media,
      }
    },
  },
})
