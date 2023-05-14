export class MappingNodeId {
  public readonly prefix: string
  public readonly id: string
  public readonly value: string

  constructor(json: any) {
    this.value = json
    ;[this.prefix, this.id] = json.split(':')
  }
}

export class MappingNodeIdList extends Array<MappingNodeId> {
  constructor(items: string[]) {
    super()
    for (const item of items) {
      this.push(new MappingNodeId(item))
    }
  }
}

export class MappingNode {
  public readonly id: number
  public readonly label: string
  public readonly ids: MappingNodeIdList
  public readonly names: string[]
  public readonly __mapped: Boolean
  public readonly children: MappingNodeList

  constructor(json: any) {
    this.id = json['id']
    this.label = json['label']
    this.ids = new MappingNodeIdList(json['ids'])
    this.names = json['names']
    const value: Boolean = json['mapped']
    this.__mapped = value ? value : false
    this.children = new MappingNodeList()
    this.children.load(json['children'])
  }

  public getPrefixes() {
    const result: Map<string, string> = new Map()
    for (const id of this.ids) {
      result.set(id.prefix, '')
    }
    return result.keys()
  }
}

export class MappingNodeList extends Array<MappingNode> {
  public load(json: Object[]) {
    for (const value of json) {
      this.push(new MappingNode(value))
    }
  }
}
