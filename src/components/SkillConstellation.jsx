import { useState } from 'react'
import Interactive3DFrame from './Interactive3DFrame'
import './SkillConstellation.css'

const positions = [
  { x: 22, y: 24, z: 22 },
  { x: 78, y: 24, z: -16 },
  { x: 24, y: 74, z: -8 },
  { x: 77, y: 74, z: 18 },
]

export default function SkillConstellation({ groups }) {
  const [activeGroup, setActiveGroup] = useState(0)
  const [activeSkill, setActiveSkill] = useState(groups[0]?.items[0] || '')
  const selectedGroup = groups[activeGroup]

  const selectGroup = (index) => {
    setActiveGroup(index)
    setActiveSkill(groups[index]?.items[0] || '')
  }

  return (
    <section className="skill-constellation-section" aria-labelledby="skill-constellation-title">
      <div className="skill-constellation-section__heading">
        <span className="aboutpage-section-label">Connected practice</span>
        <h3 id="skill-constellation-title">A map of the tools.</h3>
        <p>Rotate the field, then choose a group or skill to see what is in the working set.</p>
      </div>
      <Interactive3DFrame
        className="skill-constellation-frame"
        label="Interactive 3D constellation of Santosh's portfolio skills"
        hint="Drag to rotate · Select a node to inspect"
      >
        <div className="skill-constellation" aria-label="Skill groups and connected tools">
          <svg className="skill-constellation__links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M22 24 78 24 77 74 24 74Z M22 24 24 74 M78 24 24 74" />
            <circle cx="22" cy="24" r="1.1" /><circle cx="78" cy="24" r="1.1" /><circle cx="24" cy="74" r="1.1" /><circle cx="77" cy="74" r="1.1" />
          </svg>
          {groups.map((group, index) => {
            const position = positions[index] || { x: 50, y: 50, z: 0 }
            return (
              <article
                className={`skill-constellation__group${activeGroup === index ? ' is-active' : ''}`}
                key={group.title}
                style={{ '--group-x': `${position.x}%`, '--group-y': `${position.y}%`, '--group-z': `${position.z}px` }}
              >
                <button className="skill-constellation__hub" type="button" aria-pressed={activeGroup === index} onClick={() => selectGroup(index)}>
                  <span>0{index + 1}</span>{group.title}
                </button>
                <div className="skill-constellation__nodes">
                  {group.items.map((skill) => (
                    <button
                      className={`skill-constellation__node${activeSkill === skill && activeGroup === index ? ' is-selected' : ''}`}
                      type="button"
                      key={skill}
                      aria-pressed={activeSkill === skill && activeGroup === index}
                      onClick={() => { setActiveGroup(index); setActiveSkill(skill) }}
                    >{skill}</button>
                  ))}
                </div>
              </article>
            )
          })}
          <div className="skill-constellation__core" aria-hidden="true"><span>SS</span><i /><i /><i /></div>
          <div className="skill-constellation__readout" aria-live="polite" aria-atomic="true">
            <span>Current node / {selectedGroup?.title}</span>
            <strong>{activeSkill}</strong>
            <small>Part of the tools used across coursework and projects.</small>
          </div>
        </div>
      </Interactive3DFrame>
    </section>
  )
}
