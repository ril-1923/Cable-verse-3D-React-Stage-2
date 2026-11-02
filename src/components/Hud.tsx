import { useRideStore } from '../store/useRideStore'

const clock = (h: number) => {
  const hh = Math.floor(h) % 24
  const mm = Math.round((h - Math.floor(h)) * 60) % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export function Hud() {
  const speed = useRideStore((s) => s.speed)
  const riding = useRideStore((s) => s.riding)
  const hour = useRideStore((s) => Math.round(s.hour * 4) / 4)
  const autoTime = useRideStore((s) => s.autoTime)
  const setSpeed = useRideStore((s) => s.setSpeed)
  const toggleRide = useRideStore((s) => s.toggleRide)
  const setHour = useRideStore((s) => s.setHour)
  const setAutoTime = useRideStore((s) => s.setAutoTime)

  return (
    <div className="hud">
      <h1>Cableverse 3D</h1>
      <button onClick={toggleRide}>{riding ? 'Leave cabin' : 'Ride a cabin'}</button>
      <label>
        Simulation speed: {speed.toFixed(1)}×
        <input
          type="range" min={0} max={2.5} step={0.1} value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </label>
      <label>
        Time of day: {clock(hour)}
        <input
          type="range" min={0} max={24} step={0.25} value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
        />
      </label>
      <label className="check">
        <input type="checkbox" checked={autoTime} onChange={(e) => setAutoTime(e.target.checked)} />
        Run the day automatically
      </label>
      <p>{riding ? 'Drag to look around.' : 'Drag to orbit, scroll to zoom.'}</p>
    </div>
  )
}
