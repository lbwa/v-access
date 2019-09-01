export function fetchUserAccess(): Promise<{
  code: number
  list: { id: string; [key: string]: any }[]
}> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        list: [
          {
            id: 'react.read'
          },
          {
            id: 'vue.read'
          },
          {
            id: 'mongo.read'
          },
          {
            id: 'sql.read'
          }
        ]
      })
    }, 2000)
  })
}
