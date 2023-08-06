import { Store, createStore } from 'vuex'
import { Map2Dim, MappingNode, MappingNodeList } from './lib/classes'
import { compareNatural } from 'mathjs'

class GroupedPrefixList extends Map2Dim<string, MappingNodeList> {
  public getInitializedValue(key1: string, key2: string): MappingNodeList {
    let result: MappingNodeList | undefined = this.getValue(key1, key2)
    if (result === undefined) {
      result = new MappingNodeList()
      this.setValue(key1, key2, result)
    }
    return result
  }

  public sort(): void {
    for (const prefixList of this.values()) {
      for (const [prefix, nodeList] of prefixList) {
        nodeList.sort(
          (nodeA, nodeB) => -1 * compareNatural(nodeA.getScore(prefix), nodeB.getScore(prefix))
        )
      }
    }
  }
}

class StoreState extends Map<number, MappingNode> {
  public nodesPerLabel: Map<string, MappingNodeList> = new Map()
  public globalAnalysis: GroupedPrefixList = new GroupedPrefixList()
  public blamingSources: GroupedPrefixList = new GroupedPrefixList()
  public selectedFiles: File[] = []

  calcNodesPerLabel(): void {
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

  calcGlobalAnalysis(): void {
    for (const [label, nodes] of this.nodesPerLabel) {
      for (const node of nodes) {
        for (const prefix of node.getBadPrefixes()) {
          const nodeList: MappingNodeList = this.globalAnalysis.getInitializedValue(label, prefix)
          nodeList.push(node)
        }
      }
    }

    this.globalAnalysis.sort()
  }

  calcBlamingSources(): void {
    for (const labeledNodes of this.nodesPerLabel.values()) {
      for (const node of labeledNodes) {
        for (const [prefix, sources] of node.getBadSourcesByPrefix()) {
          for (const source of sources) {
            const nodeList: MappingNodeList = this.blamingSources.getInitializedValue(
              source,
              prefix
            )
            nodeList.push(node)
          }
        }
      }
    }

    this.blamingSources.sort()
  }
}

const store: Store<StoreState> = createStore({
  state(): StoreState {
    return new StoreState()
  },
  getters: {
    getNode:
      (state: StoreState) =>
      (nodeId: number): MappingNode | undefined => {
        return state.get(nodeId)
      },
    getNodesByLabel:
      (state: StoreState) =>
      (label: string): MappingNodeList | undefined => {
        return state.nodesPerLabel.get(label)
      }
  },
  mutations: {
    setSelectedFiles(state: StoreState, selectedFiles: File[]): void {
      state.selectedFiles = selectedFiles
    },
    loadNodes(state: StoreState, json: string): void {
      state.clear()
      state.nodesPerLabel.clear()
      state.globalAnalysis.clear()

      const lines: string[] = json.split('\n')
      for (const line of lines) {
        const object = JSON.parse(line)
        const node: MappingNode = new MappingNode(object)
        if (node.children.length > 2) {
          state.set(node.id, node)
        }
      }

      state.calcNodesPerLabel()
      state.calcGlobalAnalysis()
      state.calcBlamingSources()
    },
    clearNodes(state: StoreState): void {
      state.clear()
      state.nodesPerLabel.clear()
      state.globalAnalysis.clear()
    }
  }
})

export default store
