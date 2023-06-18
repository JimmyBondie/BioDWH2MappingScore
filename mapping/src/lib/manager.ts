import { MappingNode, MappingNodeList } from './classes'

export class MappingManager extends Map<number, MappingNode> {
  public readonly nodesPerLabel: Map<string, MappingNodeList> = new Map()
  public selectedFiles: File[] = []

  public static readonly instance: MappingManager = new MappingManager()

  private calcNodesPerLabel(): void {
    const allNodesAndLabels: Map<string, MappingNodeList> = new Map()
    for (const node of this.values()) {
      if (!allNodesAndLabels.has(node.label.value)) {
        allNodesAndLabels.set(node.label.value, new MappingNodeList())
      }
      allNodesAndLabels.get(node.label.value)?.push(node)
    }

    for (const [label, nodeList] of allNodesAndLabels.entries()) {
      const topTen: MappingNode[] = nodeList
        .sort((a, b) => b.ids.length - a.ids.length)
        .slice(0, 10)

      const list: MappingNodeList = new MappingNodeList()
      for (const element of topTen) {
        list.push(element)
      }
      this.nodesPerLabel.set(label, list)
    }
  }

  public load(json: string): void {
    this.clear()
    this.nodesPerLabel.clear()
    const lines: string[] = json.split('\n')
    const objects = lines.map((line) => JSON.parse(line))
    for (const object of objects) {
      const node: MappingNode = new MappingNode(object)
      if (node.children.length > 2) {
        this.set(node.id, node)
      }
    }
    this.calcNodesPerLabel()
  }
}
