export interface Access {
  id: string
  [accessKey: string]: any
}

export interface AccessMap {
  [mapKey: string]: Access
}
