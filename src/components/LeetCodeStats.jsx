import { UserHeatMap, UserSolvedProblemsStats } from 'react-leetcode'
import 'react-leetcode/dist/style.css'
import './LeetCodeStats.css'

const leetCodeTheme = {
  primaryColor: 'rgba(198, 240, 90, 1)',
  secondaryColor: 'rgba(167, 188, 181, 1)',
  bgColor: 'rgba(30, 48, 43, 1)',
}

function LeetCodeStats() {
  return (
    <section className="leetcode-section content-section" id="leetcode">
      <div className="section-label">01.5 / Algorithm practice</div>
      <div className="leetcode-heading">
        <div><p className="eyebrow">Live from LeetCode</p><h2>Thinking in<br /><span>patterns.</span></h2></div>
        <p>282 problems solved in Java, with a focus on arrays, strings, hash tables, dynamic programming, and binary search.</p>
      </div>
      <div className="leetcode-proof"><div><strong>282</strong><span>problems solved</span></div><div><strong>Java</strong><span>primary language</span></div><div><strong>52</strong><span>weeks of activity</span></div></div>
      <div className="leetcode-shell">
        <div className="leetcode-card"><UserSolvedProblemsStats userName="santosh102969" theme={leetCodeTheme} showUserName /></div>
        <div className="leetcode-card leetcode-heatmap"><UserHeatMap userName="santosh102969" theme={leetCodeTheme} /></div>
      </div>
      <div className="algorithm-fingerprint"><div className="fingerprint-copy"><p className="eyebrow">Problem-solving fingerprint</p><h3>Five patterns.<br /><span>One growing toolkit.</span></h3><p>These are the question families I’ve been deliberately practicing in Java.</p></div><div className="fingerprint-lanes"><div><span className="lane-index">01</span><strong>Arrays</strong><small>Traversal · prefix logic</small><i className="lane-wide" /></div><div><span className="lane-index">02</span><strong>Strings</strong><small>Parsing · windows</small><i className="lane-medium" /></div><div><span className="lane-index">03</span><strong>Hash tables</strong><small>Frequency · lookup</small><i className="lane-wide" /></div><div><span className="lane-index">04</span><strong>Dynamic programming</strong><small>States · transitions</small><i className="lane-medium" /></div><div><span className="lane-index">05</span><strong>Binary search</strong><small>Bounds · monotonicity</small><i className="lane-short" /></div></div></div>
      <a className="leetcode-link" href="https://leetcode.com/u/santosh102969/" target="_blank" rel="noreferrer">Open full LeetCode profile <span>↗</span></a>
    </section>
  )
}

export default LeetCodeStats
