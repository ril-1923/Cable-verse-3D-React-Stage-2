import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { terrainHeight } from '../lib/terrain'
import {
  LINE_Z, LOOP, STATIONS, TOWER_X, cableY, pathAt, towerTop, type StationInfo,
} from '../lib/cableway'
import { env } from '../lib/env'
import { lampMat } from '../lib/materials'

function Rope() {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let s = 0; s < LOOP; s += 0.75) {
      const p = pathAt(s)
      pts.push(new THREE.Vector3(p.x, cableY(p.x), p.z))
    }
    const curve = new THREE.CatmullRomCurve3(pts, true)
    return new THREE.TubeGeometry(curve, pts.length * 2, 0.07, 8, true)
  }, [])
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#2a2d33" metalness={0.6} roughness={0.4} />
    </mesh>
  )
}

function Tower({ x }: { x: number }) {
  const ground = terrainHeight(x, 0)
  const top = towerTop(x)
  const height = top - ground + 2
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, ground - 2 + height / 2, 0]}>
        <cylinderGeometry args={[0.28, 0.65, height, 10]} />
        <meshStandardMaterial color="#9aa3ad" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, top - 0.35, 0]}>
        <boxGeometry args={[0.9, 0.35, LINE_Z * 2 + 3]} />
        <meshStandardMaterial color="#c8412f" roughness={0.6} />
      </mesh>
      <mesh position={[0, top + 0.3, 0]} material={lampMat}>
        <sphereGeometry args={[0.22, 12, 8]} />
      </mesh>
    </group>
  )
}

function Station({ st }: { st: StationInfo }) {
  const light = useRef<THREE.PointLight>(null)
  useFrame(() => {
    if (light.current) light.current.intensity = env.night * 70
  })

  const s = st.sign
  const inward = (a: number) => st.x - s * a // a metres from the wheel centre toward the line
  const roofY = st.ropeY + 3.2
  const pillarH = roofY - st.ground
  const pillars: [number, number][] = [
    [inward(10.5), -6.2], [inward(10.5), 6.2], [inward(-4.5), -6.2], [inward(-4.5), 6.2],
  ]

  return (
    <group>
      {/* walkway between the two lines, level with the cabin floors */}
      <mesh position={[inward(5.5), st.ground + 0.5, 0]}>
        <boxGeometry args={[9, 1, 3.4]} />
        <meshStandardMaterial color="#7c8591" roughness={0.9} />
      </mesh>
      {/* entrance gate */}
      {[-1.8, 1.8].map((z) => (
        <mesh key={z} position={[inward(10), st.platY + 1.3, z]}>
          <boxGeometry args={[0.25, 2.6, 0.25]} />
          <meshStandardMaterial color="#9aa3ad" />
        </mesh>
      ))}
      <mesh position={[inward(10), st.platY + 2.7, 0]}>
        <boxGeometry args={[0.3, 0.3, 3.9]} />
        <meshStandardMaterial color="#c8412f" />
      </mesh>
      {/* roof on pillars, clear of the cabin lanes */}
      {pillars.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, st.ground + pillarH / 2, z]}>
          <boxGeometry args={[0.5, pillarH, 0.5]} />
          <meshStandardMaterial color="#9aa3ad" />
        </mesh>
      ))}
      <mesh position={[inward(3), roofY, 0]}>
        <boxGeometry args={[16, 0.4, 14.6]} />
        <meshStandardMaterial color="#c8412f" roughness={0.6} />
      </mesh>
      {/* bullwheel the rope turns around */}
      <mesh position={[st.x, st.ropeY, 0]}>
        <cylinderGeometry args={[LINE_Z, LINE_Z, 0.25, 40]} />
        <meshStandardMaterial color="#3a3f47" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* lamps */}
      {[inward(1), inward(6), inward(10)].map((x) => (
        <mesh key={x} position={[x, roofY - 0.45, 0]} material={lampMat}>
          <sphereGeometry args={[0.22, 12, 8]} />
        </mesh>
      ))}
      <pointLight
        ref={light}
        position={[inward(4), roofY - 0.9, 0]}
        color="#ffdca0"
        intensity={0}
        distance={26}
        decay={2}
      />
    </group>
  )
}

export function Cableway() {
  return (
    <>
      <Rope />
      {TOWER_X.map((x) => <Tower key={x} x={x} />)}
      {STATIONS.map((st) => <Station key={st.index} st={st} />)}
    </>
  )
}
