import * as React from 'react'
import { Dots, Line, Solid } from '../kit/react/draw'
import { BASE_ART, CARRIAGE_ART, FEEDER_ART, FRAME_ART, INDEX_ART, MODEL_ART, SOCKET_ART } from './geometry'

export const BASE = (
  <g key="base">
    <path className="iso-halo" d={BASE_ART.halo} />
    {BASE_ART.feet.map((foot, index) => (
      <g key={`foot-${index}`}>
        <Solid paths={foot[0]} tone="lo" crease="none" />
        <Solid paths={foot[1]} tone="mid" crease="none" />
      </g>
    ))}
    <Solid paths={BASE_ART.pan} tone="mid" crease="faint" />
    <Line d={BASE_ART.groove} tone="lo" />
    <Line d={BASE_ART.bevel.outline} tone="mid" />
    <Solid paths={BASE_ART.idPlate} tone="lo" crease="none" />
    <Line d={BASE_ART.idOutline} tone="faint" />
    <Line d={BASE_ART.idRules} tone="faint" free />
    <Line d={BASE_ART.bolts.rings} tone="lo" />
    <Dots points={BASE_ART.bolts.dots} size={0.58} tone="mid" />
    <Line d={BASE_ART.idScrews.rings} tone="lo" />
    <Dots points={BASE_ART.idScrews.dots} size={0.46} tone="mid" />
  </g>
)

export const FEEDER = (
  <g key="feeder">
    <Solid paths={FEEDER_ART.tray} tone="mid" crease="faint" />
    <Line d={FEEDER_ART.trayInner} tone="faint" />
    <Solid paths={FEEDER_ART.bed} tone="lo" crease="none" flat />
    {FEEDER_ART.guides.map((paths, index) => <Solid key={`guide-${index}`} paths={paths} tone="mid" crease="faint" />)}
    {FEEDER_ART.rollers.map((paths, index) => <Solid key={`roller-${index}`} paths={paths} tone="mid" crease="faint" />)}
    <Line d={FEEDER_ART.rollerRings} tone="lo" />
    <Solid paths={FEEDER_ART.motor} tone="mid" crease="faint" />
    {FEEDER_ART.bridge.map((paths, index) => <Solid key={`scanner-bridge-${index}`} paths={paths} tone="mid" crease="faint" />)}
    <Solid paths={FEEDER_ART.window} tone="hi" crease="none" flat />
    <Solid paths={FEEDER_ART.cover} tone="mid" crease="faint" />
    {FEEDER_ART.hinges.map((paths, index) => <Solid key={`cover-hinge-${index}`} paths={paths} tone="lo" crease="none" />)}
    <Solid paths={FEEDER_ART.lip} tone="hi" crease="faint" />
    <Solid paths={FEEDER_ART.card} tone="hi" crease="none" flat />
    <Line d={FEEDER_ART.cardLines} tone="faint" free />
  </g>
)

export const INDEX = (
  <g key="index">
    <Solid paths={INDEX_ART.plinth} tone="lo" crease="faint" />
    <Solid paths={INDEX_ART.cabinet} tone="mid" crease="faint" />
    <Line d={INDEX_ART.rim} tone="lo" />
    {INDEX_ART.dividers.map((paths, index) => <Solid key={`divider-${index}`} paths={paths} tone="lo" crease="faint" />)}
    {INDEX_ART.drawers.map((paths, index) => <Solid key={`drawer-${index}`} paths={paths} tone="hi" crease="faint" />)}
    {INDEX_ART.cards.map((paths, index) => <Solid key={`source-card-${index}`} paths={paths} tone="mid" crease="none" flat />)}
    <Line d={INDEX_ART.cardLines} tone="faint" free />
    {INDEX_ART.drawerFaces.map((paths, index) => <Solid key={`drawer-face-${index}`} paths={paths} tone="mid" crease="faint" />)}
    {INDEX_ART.pulls.map((paths, index) => <Solid key={`drawer-pull-${index}`} paths={paths} tone="hi" crease="faint" />)}
  </g>
)

export const MODEL_AND_OUTPUT = (
  <g key="model-and-output">
    <Solid paths={MODEL_ART.outputTray} tone="mid" crease="faint" />
    <Line d={MODEL_ART.outputRim} tone="lo" />
    {MODEL_ART.cards.map((paths, index) => <Solid key={`output-card-${index}`} paths={paths} tone="hi" crease="none" flat />)}
    <Line d={MODEL_ART.cardRules} tone="faint" free />
    <Solid paths={MODEL_ART.enclosure} tone="mid" crease="faint" />
    <Solid paths={MODEL_ART.lid} tone="hi" crease="faint" />
    <Line d={MODEL_ART.lidSeam} tone="lo" />
    {MODEL_ART.fins.map((paths, index) => <Solid key={`heat-sink-${index}`} paths={paths} tone="mid" crease="faint" />)}
    <Line d={MODEL_ART.finLines} tone="lo" />
    <Solid paths={MODEL_ART.displayStand} tone="mid" crease="faint" />
    <Solid paths={MODEL_ART.displayFrame} tone="hi" crease="faint" />
    <path className="study-bench-screen" d={MODEL_ART.displayGlass} />
    <Line d={MODEL_ART.displayRules} tone="faint" free />
    <Line d={MODEL_ART.cable} tone="mid" />
    <Solid paths={SOCKET_ART.context} tone="lo" crease="faint" />
    <Solid paths={SOCKET_ART.model} tone="lo" crease="faint" />
    <Line d={SOCKET_ART.contextRings} tone="faint" />
    <Line d={SOCKET_ART.modelRings} tone="faint" />
    <Dots points={MODEL_ART.socketDots} size={1.2} tone="hi" />
    <Solid paths={MODEL_ART.lamp} tone="hi" crease="none" />
  </g>
)

export const FRAME = (
  <g key="frame">
    {FRAME_ART.uprights.map((paths, index) => <Solid key={`upright-${index}`} paths={paths} tone="mid" crease="faint" />)}
    <Line d={FRAME_ART.supportLines} tone="faint" />
    <Solid paths={FRAME_ART.crossbeam} tone="mid" crease="faint" />
    {FRAME_ART.rails.map((paths, index) => <Solid key={`rail-${index}`} paths={paths} tone="mid" crease="faint" />)}
    <Line d={FRAME_ART.railSeams} tone="lo" />
    {FRAME_ART.stops.map((paths, index) => <Solid key={`stop-${index}`} paths={paths} tone="hi" crease="faint" />)}
    {FRAME_ART.bushings.map((paths, index) => <Solid key={`bushing-${index}`} paths={paths} tone="mid" crease="faint" />)}
    <Solid paths={FRAME_ART.ruler} tone="lo" crease="none" flat />
    <Line d={FRAME_ART.rulerMinor} tone="lo" />
    <Line d={FRAME_ART.rulerMajor} tone="mid" />
    <Line d={FRAME_ART.zero} tone="hi" />
    <Dots points={FRAME_ART.boltPoints} size={0.54} tone="mid" />
  </g>
)

export const CARRIAGE = (
  <g key="retrieval-carriage">
    <path className="iso-halo study-bench-carriage-halo" d={CARRIAGE_ART.body.fill} />
    <Solid paths={CARRIAGE_ART.body} tone="hi" lit crease="faint" />
    <Line d={CARRIAGE_ART.topInset} tone="faint" />
    {CARRIAGE_ART.blocks.map((paths, index) => <Solid key={`slide-block-${index}`} paths={paths} tone="mid" crease="faint" />)}
    <Solid paths={CARRIAGE_ART.fork} tone="mid" crease="faint" />
    <Solid paths={CARRIAGE_ART.pad} tone="hi" crease="faint" />
    <Solid paths={CARRIAGE_ART.dial} tone="mid" crease="faint" />
    <Line d={CARRIAGE_ART.dialRing} tone="lo" />
    <Line d={CARRIAGE_ART.pointer} tone="hi" />
    <Solid paths={CARRIAGE_ART.knob} tone="mid" crease="faint" />
    <Solid paths={CARRIAGE_ART.cap} tone="hi" crease="faint" />
    <Line d={CARRIAGE_ART.screws.rings} tone="lo" />
    <Dots points={CARRIAGE_ART.screws.dots} size={0.38} tone="mid" />
  </g>
)

export const STATIC_ART = (
  <React.Fragment key="static-machine">
    {BASE}
    {FEEDER}
    {INDEX}
    {MODEL_AND_OUTPUT}
    {FRAME}
  </React.Fragment>
)
