import type {StructureResolver} from 'sanity/structure'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Posts').child(S.documentTypeList('post').title('Posts')),
      S.listItem().title('Zakoni').child(S.documentTypeList('zakon').title('Zakoni')),
      S.listItem().title('Kvizovi').child(S.documentTypeList('quiz').title('Kvizovi')),
      S.listItem().title('Categories').child(S.documentTypeList('category').title('Categories')),
      S.listItem()
        .title('Comments')
        .child(
          S.documentTypeList('comment')
            .title('Comments')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
        ),
    ])
