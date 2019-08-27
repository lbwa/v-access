export function fetchUserAccess() {
  return Promise.resolve({
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
}
