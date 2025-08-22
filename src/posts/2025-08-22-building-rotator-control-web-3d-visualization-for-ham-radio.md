---
title: "Building RotatorControlWeb: 3D Visualization for Ham Radio Antenna Control"
date: "2025-08-22"
tags: ["Ham Radio", "Node.js", "Three.js", "Docker", "Web Development", "Amateur Radio"]
---

## Introduction

As a ham radio enthusiast, precise antenna positioning can make the difference between a clear contact halfway around the world and static. Traditional rotor controllers, while functional, often rely on basic numeric displays or simple compass indicators. I wanted something more intuitive and visually engaging. That's why I built [RotatorControlWeb](https://github.com/brianbruff/RotatorControlWeb) – a web-based interface that brings antenna rotor control into the modern era with a 3D interactive globe.

## The Problem with Traditional Rotor Control

Most antenna rotor controllers present azimuth information as degrees on a numeric display or a basic compass rose. While accurate, this approach has limitations:

- It's not immediately intuitive where 237° actually points on the globe
- Visualizing great circle paths to distant stations requires mental gymnastics
- Remote operation often means clunky desktop software or no interface at all
- Multiple operators can't easily share the same visual reference

## Enter RotatorControlWeb

RotatorControlWeb transforms antenna rotor control into an interactive 3D experience. Using a globe visualization powered by Three.js, operators can see exactly where their antenna is pointing and click anywhere on the globe to command a new heading. The great circle path is displayed in real-time, making it crystal clear where your signal is going.

## Technical Architecture

The application follows a modern web architecture designed for reliability and ease of deployment:

### Backend Stack
- **Node.js with Express**: Provides a lightweight, efficient server for handling WebSocket connections and API requests
- **rotctld Integration**: Communicates with the Hamlib rotctld daemon for hardware abstraction
- **WebSocket Support**: Enables real-time bidirectional communication for instant position updates
- **Authentication Layer**: Protects your rotor control from unauthorized access

### Frontend Technologies
- **Globe.GL**: A Three.js-based library that renders the interactive 3D globe
- **Tailwind CSS**: Provides responsive, professional styling without the bloat
- **Turf.js**: Handles geospatial calculations for great circle paths and distance measurements
- **Vanilla JavaScript**: Keeps the frontend lightweight and dependency-free

### Deployment Options

One of RotatorControlWeb's strengths is its flexibility in deployment:

1. **Docker Hub (Simplest)**
   ```bash
   docker run -p 3000:3000 brianbruff/rotatorcontrolweb
   ```

2. **Docker Compose (Recommended for Production)**
   - Includes environment variable configuration
   - Easy to integrate with existing Docker stacks
   - Supports custom network configurations

3. **Build from Source**
   - Full control over the build process
   - Ability to customize and extend

4. **Direct Node.js Installation**
   - Traditional deployment for those who prefer it
   - Works on any system with Node.js 14+

## Key Features in Action

### Interactive 3D Globe
The centerpiece of RotatorControlWeb is its interactive globe. The current antenna heading is displayed as a colored beam extending from your QTH (station location) to the horizon. This visualization immediately shows:
- Current azimuth direction
- Great circle path to target
- Geographic context for your antenna heading

### Click-to-Point Control
Simply click anywhere on the globe, and the rotor will automatically turn to that heading. No more mental math converting between geographic locations and azimuth degrees – the system handles it all automatically.

### Real-Time Position Updates
The WebSocket connection ensures that multiple operators can view the same rotor simultaneously, with all clients updating in real-time as the antenna moves. This is particularly useful for:
- Club stations with multiple operators
- Remote operation scenarios
- Training new operators

### Manual Controls
For fine-tuning or traditional operation, manual controls are available:
- Direct azimuth input for precise degree control
- Increment/decrement buttons for small adjustments
- Emergency stop for immediate halt of rotor movement

### Auto-Reconnect
Network disruptions are handled gracefully with automatic reconnection to the rotctld daemon. This ensures reliable operation even in less-than-ideal network conditions.

## Implementation Challenges and Solutions

### Challenge 1: Real-Time Synchronization
Keeping multiple clients synchronized with actual rotor position required careful WebSocket state management. The solution involved:
- Server-side position caching to handle new client connections
- Debounced updates to prevent flooding
- Heartbeat mechanism to detect disconnected clients

### Challenge 2: Cross-Platform Rotor Support
Different rotor models have varying capabilities and protocols. By leveraging Hamlib's rotctld daemon, RotatorControlWeb can support virtually any rotor hardware without modification.

### Challenge 3: Security
Exposing rotor control to the network requires careful security consideration. The application implements:
- Password authentication for access control
- Environment-based configuration for sensitive settings
- Optional HTTPS support for encrypted communication

## Real-World Usage

Since deploying RotatorControlWeb at my station, it has transformed how I operate:

- **DX Hunting**: Clicking on a DX spot's location instantly points the antenna for optimal signal
- **Contesting**: Rapid antenna changes become visual and intuitive
- **Demonstration**: Showing non-hams how radio waves travel around the globe becomes engaging and educational

## Open Source and Community

RotatorControlWeb is released under the MIT License, encouraging community contribution and adaptation. The ham radio community has always been about sharing knowledge and improving our collective capabilities. Some ways the community can contribute:

- Adding support for elevation control (for satellite work)
- Integrating with logging software for automatic antenna positioning
- Creating themes for different visual preferences
- Adding propagation prediction overlays

## Future Enhancements

The roadmap for RotatorControlWeb includes several exciting features:

1. **Elevation Control**: Support for AZ/EL rotors used in satellite communication
2. **Multiple Rotor Support**: Control several antennas from a single interface
3. **Band Conditions Overlay**: Display current propagation conditions on the globe
4. **QSO History**: Show previous contacts as points on the globe
5. **Mobile App**: Native iOS/Android apps for rotor control on the go

## Getting Started

If you're interested in trying RotatorControlWeb, the easiest way is via Docker:

```bash
docker run -d \
  -p 3000:3000 \
  -e ROTCTLD_HOST=your-rotctld-host \
  -e PASSWORD=your-password \
  brianbruff/rotatorcontrolweb
```

For detailed installation instructions and configuration options, visit the [GitHub repository](https://github.com/brianbruff/RotatorControlWeb).

## RotatorControlWeb in Action

Below is the RotatorControlWeb interface showing the 3D globe visualization with real-time antenna heading display. The interface provides intuitive click-to-point control and manual adjustment options:

![RotatorControlWeb Interface - 3D Globe Visualization for Antenna Control](/rotator-control-web-interface.png)

## Conclusion

RotatorControlWeb represents a modern approach to an age-old ham radio challenge. By combining web technologies with amateur radio hardware, we can create interfaces that are not only functional but also engaging and intuitive. Whether you're a seasoned DXer or new to the hobby, visual tools like this can enhance your operating experience and make ham radio more accessible to the next generation of operators.

The project is actively maintained and welcomes contributions from the community. Feel free to open issues, submit pull requests, or fork the project for your own experiments. After all, experimentation and innovation are at the heart of amateur radio.

73,
Brian EI7GTB