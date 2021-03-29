import queue from 'queue'

const q = queue({ results: [] })
q.concurrency = 10
q.autostart = true

export default function buildD3BarChartBuilder (svg, data, showBarValues) {
    q.push(function (cb) {
      svg
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('width', d => d.width)
        .attr('x', d => d.x)
        .attr('fill', d => d.color)
        .attr('y', d => d.y)
        .attr('height', d => d.height);

      if (showBarValues) {
        svg
          .selectAll('text')
          .data(data)
          .enter()
          .append('text')
          .text(d => d.text)
          .attr('text-anchor', 'middle')
          .attr('x', d => d.width - (d.text.length + 15))
          .attr('y', d => d.y + 10)
          .attr('font-size', '11px')
          .attr('fill', 'white');
      }
      setTimeout(function () {
        cb()
      }, 100)
    })
}