# WebGL / Three.js 3D City Prompt

Make WebGL the core visual layer of the DevOps website.

Use:
- Three.js
- React Three Fiber
- @react-three/drei
- GLTF/GLB models
- Framer Motion for UI transitions

The city must be an actual interactive 3D environment, not a flat background.

## City

Create one coherent natural sustainable technology colony containing:

01 CODE
02 BUILD
03 TEST
04 PACKAGE
05 DEPLOY
06 MONITOR

Architecture:
- concrete buildings
- glass facades
- wood accents
- curved balconies
- rooftop gardens
- planted terraces
- mature trees
- pedestrian bridges
- roads
- sidewalks
- parking
- utility structures
- service vehicles

The environment must look like a real contemporary development, not a futuristic city.

## Physical pipeline

Communicate the flow through:
roads
bridges
walkways
utility corridors
underground infrastructure
subtle copper infrastructure lighting

Never use floating digital arrows or holograms.

## Interaction

Hovering a district:
- subtly highlights the building
- reveals technical label
- emphasizes its physical connection
- slightly shifts camera focus

Clicking:
- smoothly moves camera to district
- opens an adjacent HTML editorial panel
- provides BACK TO CITY

## Scroll story

Start with complete city overview.

As the user scrolls:
01 CODE → 02 BUILD → 03 TEST → 04 PACKAGE → 05 DEPLOY → 06 MONITOR

Camera movement should feel like travelling through a real architectural development.

## Camera

Use a constrained orbit camera with damping, controlled zoom and limited polar angles.
Default view should be a high architectural aerial perspective.

## Lighting

Natural late-afternoon daylight:
- directional sunlight
- soft ambient illumination
- realistic contact shadows
- ambient occlusion
- restrained reflections

No neon, cyberpunk, holographic lighting or excessive bloom.

## Details

Add:
trees
shrubs
grass
cars
delivery vans
pedestrians
street lamps
road markings
drainage
utility boxes
rooftop HVAC
solar panels
water tanks
maintenance equipment

Keep them secondary to the six main districts.

## Performance

Use:
GLB/GLTF
Draco
KTX2 where useful
LOD
instancing
texture atlases
frustum culling
lazy loading
progressive loading

Repeated objects such as trees, vehicles and lamps should use instancing.

Provide a simplified scene for low-power/mobile devices and a static-image fallback if WebGL
is unavailable.

## Architecture

Create reusable components:
DevOpsCity
CityBuilding
PipelineDistrict
PipelineRoute
CityTree
CityVehicle
StageLabel
CityCamera
CityLighting
ArchitectureOverlay
StagePanel

Keep districts data-driven with configurable positions, camera positions, targets and
descriptions.
