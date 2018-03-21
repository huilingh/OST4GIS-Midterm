var _ = require('lodash'),
    ss = require('simple-statistics'),
    chroma = require('chroma-js')

module.exports = {

  // JENKS
  jenks: function(fc, z, numBreaks, colors, style){
    var vals = _.chain(fc.features)
      .pluck('properties')
      .pluck(z)
      .value()
      
    var breaks = ss.jenks(vals, numBreaks)
    var normals = normalize(breaks.length)
    fc = colorize(fc, z, colors, breaks, normals)
    fc = setLegend(fc, z, colors, breaks, normals)
    fc = applyStyle(fc, style)
    return fc
  },

  // QUANTILES
  quantiles: function(fc, z, numBreaks, colors, style){
    var vals = _.chain(fc.features)
      .pluck('properties')
      .pluck(z)
      .value()

    var min = ss.min(vals)
    var max = ss.max(vals)
    var interval = 1 / numBreaks
    var quants = [0]
    var currentBreak = 0
    for(var i=0;i<numBreaks;i++){
      currentBreak += interval
      quants.push(currentBreak)
    }
    var breaks = ss.quantile(vals, quants)
    var normals = normalize(breaks.length)
    fc = colorize(fc, z, colors, breaks, normals)
    fc = setLegend(fc, z, colors, breaks, normals)
    fc = applyStyle(fc, style)
    return fc
  },

  // EQUAL INTERVAL
  equalIntervals: function(fc, z, numBreaks, colors, style){
    var vals = _.chain(fc.features)
      .pluck('properties')
      .pluck(z)
      .value()

    var min = ss.min(vals)
    var max = ss.max(vals)
    var interval = (max - min) / numBreaks
    var breaks = [0]
    var currentBreak = 0
    for(var i=0;i<=numBreaks;i++){
      currentBreak += interval
      breaks.push(currentBreak)
    }
    var normals = normalize(breaks.length)
    fc = colorize(fc, z, colors, breaks, normals)
    fc = setLegend(fc, z, colors, breaks, normals)
    fc = applyStyle(fc, style)
    return fc
  },

  // CUSTOM
  custom: function(fc, z, breaks, colors, style){
    var vals = _.chain(fc.features)
      .pluck('properties')
      .pluck(z)
      .value()

    var normals = normalize(breaks.length)
    fc = colorize(fc, z, colors, breaks, normals)
    fc = setLegend(fc, z, colors, breaks, normals)
    fc = applyStyle(fc, style)
    return fc
  },

  // RANDOM
  random: function(fc, colors, style){
    var normals = normalize(colors.length)
    _.each(fc.features, function(f){
      var rand = Math.floor(Math.random()*colors.length)
      var colorHex = chroma(colors[rand]).hex()
      f = setColor(f, colorHex)
    })
    fc = applyStyle(fc, style)
    return fc
  },

  // ALL
  all: function(fc, style){
    fc = applyStyle(fc, style)
    return fc
  }

}

function applyStyle(fc, style){
  _.each(fc.features, function(f){
    _.each(style, function(val, key){
      if(_.contains(['stroke', 'fill', 'marker-color'], key)){
        f.properties[key] = chroma(val).hex()
      }
      else{
        f.properties[key] = val
      }
    })
  })
  return fc
}

function colorize(fc, z, colors, breaks, normals){
  var scale = chroma.scale(colors);
  _.each(fc.features, function(f){
    _.each(breaks, function(b1, i){
      var b2 = breaks[i + 1]
      var colorHex = scale(normals[i+1]).hex()
      if(f.properties[z] >= b1 && f.properties[z] < b2){
        f = setColor(f, colorHex)
      }
      else if(f.properties[z] >= b2){
        f = setColor(f, colorHex)
      }
    })
  })
  return fc
}

function setLegend(fc, z, colors, breaks, normals){
  var legend = {
    symbols: []
  }
  var scale = chroma.scale(colors);
  _.each(breaks, function(b1, i){
    var b2 = breaks[i + 1]
    var colorHex = scale(normals[i+1]).hex()
    var symbol = {
      from: b1,
      to: b2,
      color: colorHex
    }
    legend.symbols.push(symbol)
  })
  legend.symbols.pop()
  legend.title = z
  fc.legend = legend
  return fc
}

function setColor(feature, colorHex){
  if(feature.geometry.type === 'Point'){
    feature.properties['marker-color'] = colorHex
    return feature
  }
  else if(feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString'){
    feature.properties['fill'] = 0
    feature.properties['stroke'] = colorHex
    feature.properties['stroke-opacity'] = .8
    feature.properties['stroke-width'] = 3
    return feature
  }
  else if(feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'){
    feature.properties['fill'] = colorHex
    feature.properties['stroke'] = '#000000'
    feature.properties['fill-opacity'] = .8
    return feature
  }
}

function normalize(numBreaks)
{
  var normals = [0]
  var interval = 1 / numBreaks
  var currentBreak = 0
  for(var i=0;i<numBreaks;i++){
    currentBreak += interval
    normals.push((currentBreak).toFixed(4))
  }
  return normals
}
