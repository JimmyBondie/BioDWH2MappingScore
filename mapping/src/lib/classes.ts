import { abs, mean, std } from 'mathjs'

class Map2Dim<K, V> extends Map<K, Map<K, V>> {
  public getValue(key1: K, key2: K): V | undefined {
    if (!this.has(key1)) {
      this.set(key1, new Map())
    }

    const value1: Map<K, V> = this.get(key1) as Map<K, V>

    return value1.get(key2)
  }

  public setValue(key1: K, key2: K, value: V): void {
    if (!this.has(key1)) {
      this.set(key1, new Map())
    }

    const value1: Map<K, V> = this.get(key1) as Map<K, V>

    value1.set(key2, value)
  }
}

export class ScoreData {
  private allIds: number
  private countAllNodes: number

  public countCurrentNode: number

  constructor(allIds: number, sourceCounts?: Map<string, number>) {
    this.allIds = allIds
    this.countCurrentNode = 1
    this.countAllNodes = 0
    if (sourceCounts) {
      for (const source of sourceCounts.values()) {
        this.countAllNodes += source
      }
    }
  }

  get probability(): number {
    if (this.allIds > 0) {
      return this.countCurrentNode / this.allIds
    } else {
      return 0
    }
  }

  get score(): number {
    const prob: number = this.probability
    if (prob > 0) {
      return this.countAllNodes / this.probability
    } else {
      return 0
    }
  }
}

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

export class MappingNodeLabel {
  public readonly source: string
  public readonly name: string
  public readonly value: string

  constructor(json: any) {
    this.value = json
    ;[this.source, this.name] = json.split('_')
  }
}

export class MappingNode {
  public readonly id: number
  public readonly label: MappingNodeLabel
  public readonly ids: MappingNodeIdList
  public readonly names: string[]
  public readonly __mapped: boolean
  public readonly children: MappingNodeList

  private scores: Map<string, ScoreData>

  constructor(json: any) {
    this.id = json['id']
    this.label = new MappingNodeLabel(json['label'])
    this.ids = new MappingNodeIdList(json['ids'])
    this.names = json['names']
    const value: boolean = json['__mapped']
    this.__mapped = value ? value : false
    this.children = new MappingNodeList()
    this.children.load(json['children'])

    this.scores = new Map()
  }

  public getPrefixes(): IterableIterator<string> {
    const result: Map<string, string> = new Map()
    for (const id of this.ids) {
      result.set(id.prefix, '')
    }
    return result.keys()
  }

  private calcPrefixBySource(map: Map2Dim<string, number>): void {
    if (this.children.length == 0) {
      const source: string = this.label.source
      for (const id of this.ids) {
        const prefix: string = id.prefix
        map.setValue(prefix, source, (map.getValue(prefix, source) || 0) + 1)
      }
    } else {
      for (const child of this.children) {
        child.calcPrefixBySource(map)
      }
    }
  }

  private calcScores(): void {
    const prefixBySource: Map2Dim<string, number> = new Map2Dim()
    this.calcPrefixBySource(prefixBySource)

    for (const id of this.ids) {
      const prefix: string = id.prefix
      const scoreData: ScoreData | undefined = this.scores.get(prefix)
      if (scoreData != undefined) {
        scoreData.countCurrentNode++
      } else {
        this.scores.set(prefix, new ScoreData(this.ids.length, prefixBySource.get(prefix)))
      }
    }
  }

  public getScore(prefix: string): number {
    if (this.scores.size == 0) {
      this.calcScores()
    }
    return Math.round(this.scores.get(prefix)?.score || 0)
  }

  public getBadPrefixes(): Array<string> {
    const scores: Array<number> = new Array()
    for (const prefix of this.getPrefixes()) {
      scores.push(this.getScore(prefix))
    }

    const meanScore: number = mean(scores)
    const stdDeviation: number = std(scores, 'unbiased') // 'unbiased' is default
    const maxDelta: number = 2 * stdDeviation

    const badPrefixes: Array<string> = []
    for (const prefix of this.getPrefixes()) {
      if (abs(meanScore - this.getScore(prefix)) > maxDelta) {
        badPrefixes.push(prefix)
      }
    }

    return badPrefixes
  }
}

export class MappingNodeList extends Array<MappingNode> {
  public load(json: Object[]): void {
    for (const value of json) {
      this.push(new MappingNode(value))
    }
  }
}
