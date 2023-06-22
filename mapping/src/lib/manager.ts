import { MappingNode, MappingNodeList, Map2Dim } from './classes'

class GlobalAnalysisData extends Map2Dim<string, MappingNodeList> {
  public getInitializedValue(key1: string, key2: string): MappingNodeList {
    let result: MappingNodeList | undefined = this.getValue(key1, key2)
    if (result === undefined) {
      result = new MappingNodeList()
      this.setValue(key1, key2, result)
    }
    return result
  }
}

export class MappingManager extends Map<number, MappingNode> {
  public readonly nodesPerLabel: Map<string, MappingNodeList> = new Map()
  public readonly globalAnalysis: GlobalAnalysisData = new GlobalAnalysisData()
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

  private calcGlobalAnalysis(): void {
    for (const [label, nodes] of this.nodesPerLabel) {
      for (const node of nodes) {
        for (const prefix of node.getBadPrefixes()) {
          const nodeList: MappingNodeList = this.globalAnalysis.getInitializedValue(label, prefix)
          nodeList.push(node)
        }
      }
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
    this.calcGlobalAnalysis()
  }
}
