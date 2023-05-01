window.mappingTrees = {}

function loadCluster(id) {
  var mappingContent = document.getElementById('mappingContent')
  if (!Object.hasOwnProperty.call(window.mappingTrees, id)) {
    mappingContent.innerHTML = ''
    return
  }
  var node = window.mappingTrees[id]
  mappingContent.innerHTML =
    '<h3>Mapping cluster ' + id + ' (' + node.label + ')</h3>' + createTreeTableRecursive(node)
  var idPills = document.getElementsByClassName('id-pill')
  for (var i = 0; i < idPills.length; i++) {
    idPills[i].addEventListener('click', (e) => {
      for (var j = 0; j < idPills.length; j++) {
        if (idPills[j].innerText === e.target.innerText) {
          idPills[j].style.borderWidth = idPills[j].style.borderWidth == '0px' ? '1px' : '0px'
        }
      }
    })
  }
}

function collectIdSourceCountsRecursive(ids, node) {
  if (node.children.length === 0) {
    for (var i = 0; i < node.ids.length; i++) {
      var id = node.ids[i]
      var sourceId = node.label.split('_', 2)[0]
      if (!Object.prototype.hasOwnProperty.call(ids, id)) {
        ids[id] = {}
      }
      if (!Object.prototype.hasOwnProperty.call(ids[id], sourceId)) {
        ids[id][sourceId] = 1
      } else {
        ids[id][sourceId] += 1
      }
    }
  } else {
    for (var i = 0; i < node.children.length; i++) {
      collectIdSourceCountsRecursive(ids, node.children[i])
    }
  }
}

function collectPrefixSourceCountsRecursive(ids, node) {
  if (node.children.length === 0) {
    for (var i = 0; i < node.ids.length; i++) {
      var prefix = node.ids[i].split(':', 2)[0]
      var sourceId = node.label.split('_', 2)[0]
      if (!Object.prototype.hasOwnProperty.call(ids, prefix)) {
        ids[prefix] = {}
      }
      if (!Object.prototype.hasOwnProperty.call(ids[prefix], sourceId)) {
        ids[prefix][sourceId] = 1
      } else {
        ids[prefix][sourceId] += 1
      }
    }
  } else {
    for (var i = 0; i < node.children.length; i++) {
      collectPrefixSourceCountsRecursive(ids, node.children[i])
    }
  }
}

function createTreeTableRecursive(node) {
  var text = '<table class="table table-bordered border-primary"><tbody>'
  text += '<tr>'
  if (node.children.length > 0) {
    text += '<td>'
    for (var i = 0; i < node.children.length; i++) {
      text += createTreeTableRecursive(node.children[i])
    }
    text += '</td>'
  }
  text += '<td colspan="' + node.children.length + '">'
  if (node.__mapped == false) {
    text += '<span class="badge bg-primary">'
  } else {
    text += '<span class="badge bg-secondary">'
  }
  text += node.label
  text += '</span>'
  text += '<br/><span class="badge bg-light text-dark">' + node.id + '</span>'
  text += '<br/><strong>IDs:</strong> '
  var idSourceCounts = {}
  var prefixSourceCounts = {}
  collectIdSourceCountsRecursive(idSourceCounts, node)
  collectPrefixSourceCountsRecursive(prefixSourceCounts, node)
  var idOverlap = {}
  for (var i = 0; i < node.children.length; i++) {
    for (var j = 0; j < node.children[i].ids.length; j++) {
      var id = node.children[i].ids[j]
      if (Object.prototype.hasOwnProperty.call(idOverlap, id)) {
        idOverlap[id] += 1
      } else {
        idOverlap[id] = 1
      }
    }
  }
  var idPrefixCounts = {}
  for (var i = 0; i < node.ids.length; i++) {
    var id = node.ids[i]
    var prefix = id.split(':', 2)[0]
    if (Object.prototype.hasOwnProperty.call(idPrefixCounts, prefix)) {
      idPrefixCounts[prefix][0] += 1
      idPrefixCounts[prefix][1] = idPrefixCounts[prefix][0] / node.ids.length
    } else {
      idPrefixCounts[prefix] = [
        1,
        1 / node.ids.length,
        Object.values(prefixSourceCounts[prefix]).reduce((partialSum, a) => partialSum + a, 0),
        0
      ]
    }
    idPrefixCounts[prefix][3] = idPrefixCounts[prefix][2] / idPrefixCounts[prefix][1]
    var color = idOverlap[id] > 1 ? 'bg-info text-dark' : 'bg-light text-dark'
    text +=
      '<span class="badge rounded-pill ' +
      color +
      ' id-pill" style="border-style: solid; border-color: black; border-width: 0px">' +
      id +
      '</span>'
  }
  text += '<br/><strong>Names:</strong> '
  for (var i = 0; i < node.names.length; i++) {
    text += '<span class="badge rounded-pill bg-light text-dark">' + node.names[i] + '</span>'
  }
  var idPrefixes = Object.keys(idPrefixCounts).sort(
    (a, b) => idPrefixCounts[b][3] - idPrefixCounts[a][3]
  )
  if (idPrefixes.length > 1) {
    text += '<br/><strong>ID Prefixes:</strong> '
    for (var i = 0; i < idPrefixes.length; i++) {
      var prefix = idPrefixes[i]
      var prefixScores = idPrefixCounts[prefix]
      var color = /*i === 0 ? 'bg-danger' : */ 'bg-secondary'
      text +=
        '<span class="badge rounded-pill ' +
        color +
        '">' +
        prefix +
        ' (s: ' +
        prefixScores[3].toFixed(3).replace(/\.0+$/, '') +
        ')</span>'
    }
  }
  text += '</td>'
  text += '</tr></tbody></table>'
  return text
}

function updateMappingInfoText() {
  var labels = []
  Object.values(window.mappingTrees).forEach((v) => {
    if (labels.indexOf(v.label) == -1) {
      labels.push(v.label)
    }
  })
  var infoText =
    '<div class="alert alert-success" role="alert">Loaded ' +
    Object.keys(window.mappingTrees).length +
    ' mapping clusters</div>'
  infoText += '<table class="table table-bordered"><tbody><tr>'
  for (let i = 0; i < labels.length; i++) {
    var clusterForLabel = Object.keys(window.mappingTrees)
      .filter((id) => window.mappingTrees[id].label === labels[i])
      .map((id) => [id, window.mappingTrees[id].ids.length])
    var topTenForLabel = clusterForLabel.sort((a, b) => b[1] - a[1]).slice(0, 10)
    infoText += '<td><strong>' + labels[i] + ' (' + clusterForLabel.length + ')</strong><br/><ul>'
    infoText += topTenForLabel
      .map(
        (x) =>
          '<li><a href="#mappingContent" onclick="loadCluster(' +
          x[0] +
          ')">' +
          x[0] +
          ' (' +
          x[1] +
          ')</a></li>'
      )
      .join('')
    infoText += '</ul></td>'
  }
  infoText += '</tr></tbody></table>'
  mappingInfo.innerHTML = infoText
}

window.addEventListener(
  'load',
  function () {
    var mappingInfo = document.getElementById('mappingInfo')
    var input = document.getElementById('mappingLogInput')
    input.addEventListener('change', function () {
      var file = this.files[0]
      var reader = new FileReader()
      reader.onload = function () {
        var lines = this.result.split('\n')
        for (var line = 0; line < lines.length; line++) {
          var tree = JSON.parse(lines[line])
          // Ignore singleton mapped nodes (just one source node connected to a mapped node)
          if (tree.children.length > 2) {
            window.mappingTrees[tree.id] = tree
          }
        }
        updateMappingInfoText()
        loadCluster(354991497659) // TEST
      }
      reader.readAsText(file)
    })
    setupTooltips()
    setupSearchClusterInput()
  },
  false
)

function setupTooltips() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach((e) => new bootstrap.Tooltip(e))
}

function setupSearchClusterInput() {
  new autoComplete({
    placeholder: 'Search for name or id...',
    selector: '#searchClusterInput',
    debounce: 300,
    threshold: 3,
    data: {
      src: async (q) => {
        return Object.values(window.mappingTrees)
          .filter((v) => {
            for (var i = 0; i < v.ids.length; i++) {
              if (v.ids[i].includes(q)) {
                return true
              }
            }
            for (var i = 0; i < v.names.length; i++) {
              if (v.names[i].includes(q)) {
                return true
              }
            }
            return false
          })
          .map((v) => {
            return {
              id: v.id,
              label: v.label,
              ids: v.ids.join('; '),
              names: v.names.join('; ')
            }
          })
      },
      keys: ['ids', 'names']
    },
    resultsList: {
      tag: 'ul',
      class: 'list-group'
      // TODO: not working somehow maxResults: 10
    },
    resultItem: {
      tag: 'li',
      class: 'list-group-item',
      element: (item, data) => {
        item.style = 'display: flex; justify-content: space-between;'
        item.innerHTML = `
          <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; font-size: 10px;">${data.match}</span>
          <span style="font-weight: bold; font-size: 10px; margin-left: 8px;">${data.value.label}</span>
        `
      },
      highlight: true
    }
  })
  document.querySelector('#searchClusterInput').addEventListener('selection', function (event) {
    loadCluster(event.detail.selection.value.id)
  })
}

function clearElementChildren(el) {
  while (el.firstChild) {
    el.firstChild.remove()
  }
}
