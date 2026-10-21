# Moving Neural Network

## Figure brief

**Size:** Hero visualization: 22 neuron nodes and 104 synapses, with four layer planes, a floor grid, mode controls, and an inspector.

**Concept:** A four-layer learning network floats in a shallow 3D volume; neurons shift through depth while activation travels from the selected input to its output.

## Parts and motion

- Each neuron keeps a stable home inside its layer, then drifts slightly in x, y, and z. Perspective changes its position, scale, and depth order.
- Synapses are cubic curves in world space, reprojected as their neurons move.
- Selected synapses carry small light pulses from input toward output. Selected neurons brighten as those pulses pass.
- The camera keeps a steady angle while neurons shift through the volume. Dragging or arrow keys steer the camera directly.
- A pause control, reduced-motion support, and offscreen suspension keep the movement readable and accessible.
- Clicking an input or output continues to select its existing project pathway.
