# view-graph

<a href="https://www.npmjs.com/package/view-graph">
  <img src="https://img.shields.io/npm/v/view-graph.svg?logo=npm" alt="Last npm Registry Version">
</a>


This project allows automatically render graphs for visualization and analysis. Enjoy exploring graphs directly in the web browser. 

The `view-graph` takes descriptions of graphs in a simple JSON format, and makes diagrams in automatic mode.



- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Options](#options)

## Installation

```
npm install view-graph lit-html --save
```


Or use a content delivery network:

[unpkg.com CDN](https://unpkg.com/view-graph):

```html
<script src="https://unpkg.com/view-graph"></script>
```

---

## Usage

### Without bundling

[Demo](https://codepen.io/sumbad/pen/ZExGbpe)

### With ReactJS

[Demo](https://codesandbox.io/s/view-graph-react-q8wn87?file=/src/App.tsx)

---

## API

WIP

---

## Options


<table>
  <thead>
    <tr>
    <th>Property</th>
    <th>Attribute</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>data</code>
      </td>
      <td>
        -
      </td>
      <td>
        <a href="./src/@types/graph.type.ts">GraphData</a>
      </td>
      <td>
        -
      </td>
      <td>
        Nodes and edges for creating a graph
      </td>
    </tr>
    <tr>
      <td>
        <code>edgeStyle</code>
      </td>
      <td>
        -
      </td>
      <td>
        <a href="./src/@types/graph.type.ts">EdgeStyle</a>
      </td>
      <td>
        <code>polyline</code>
      </td>
      <td>
        <b>polyline</b> - straight lines
        <br>
        <b>curve</b> - smooth curved lines
      </td>
    </tr>
    <tr>
      <td>
        <code>nodeStyle</code>
      </td>
      <td>
        -
      </td>
      <td>
        <a href="./src/@types/graph.type.ts">NodeStyle</a>
      </td>
      <td>
        An SVG rectangle
      </td>
      <td>
        This SVG will be using as nodes image
      </td>
    </tr>
  </tbody>
</table>

---



It uses [dagre](https://github.com/dagrejs/dagre) under the hood for lay out directed graphs.


## License

**view-graph** is licensed under the terms of the MIT License. See [LICENSE](./LICENSE) for details.