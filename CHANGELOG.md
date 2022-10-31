# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!-- ## [X.Y.Z] - YYYY-MM-DD -->

<!-- ### Added -->
<!-- ### Changed -->
<!-- ### Deprecated -->
<!-- ### Removed -->
<!-- ### Fixed -->
<!-- ### Security -->

<!-- ## Unreleased -->


## Unreleased

### Added
  + The toggleTooltip method can be used for show or hide a tooltip for a graph's node.
  + Update Callbacks API, added reactions for entering and leaving nodes

## [[0.4.0](https://github.com/sumbad/view-graph/releases/tag/v0.4.0)] - 2022-08-22

### Added
  + Update Callbacks API, added reactions for entering and leaving edges
  + Use the arrow keys on the keyboard to move the graph


## [[0.3.5 - 0.3.6](https://github.com/sumbad/view-graph/releases/tag/v0.3.6)] - 2022-07-28

### Changed
  + Involve `id` required property to GraphDataEdge type


## [[0.3.0 - 0.3.5](https://github.com/sumbad/view-graph/releases/tag/v0.3.5)] - 2022-07-27

### Added
  + Overwrite the component's styles
  + Add `name` attribute to base elements

### Fixed
  + Return right types for the React adapter instead of `any`
  + Update graph's css if the property was changed


## [[0.2.0](https://github.com/sumbad/view-graph/releases/tag/v0.2.0)] - 2022-07-26

### Added
  + Define a different style for a node by style IDs.
  + Emit evens by click on nodes.
  + Emit evens by click on edges.
  + Add an element to center and set a default scaling.
  + Add buttons for scaling (+/-).

### Fixed
  + Overlapping nodes' labels.



## [[0.1.1](https://github.com/sumbad/view-graph/releases/tag/v0.1.1)] - 2022-07-17

### Fixed
  - Update dependencies, resolve errors with Nodes rendering



## [[0.1.0](https://github.com/sumbad/view-graph/releases/tag/v0.0.1)] - 2022-07-08

### Added
  - Show a tooltip for Nodes with additional information

### Fixed
  - Resolve a problem with showing a whole graph with paddings


## [[0.0.4 - 0.0.6](https://github.com/sumbad/view-graph/releases/tag/v0.0.6)] - 2022-07-05

### Fixed
  - Calculate a graph's viewBox dependently on IntersectionObserver for right work with VDOM


## [[0.0.2 - 0.0.3](https://github.com/sumbad/view-graph/releases/tag/v0.0.3)] - 2022-07-02

### Added
  - Create a wrapper component for React.
### Fixed
  - Export types according to available modules in directories.
  - Return ViewGraph object inside IIFE module.


## [[0.0.1](https://github.com/sumbad/view-graph/releases/tag/v0.0.1)] - 2022-07-01

### First release

### Start the project - 2022-06-17
