import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../hooks/useTheme.js'

export default function PerformanceChart({ performance }) {
  const { theme } = useTheme()
  const colors = useMemo(() => {
    const styles = getComputedStyle(document.documentElement)
    const read = (name) => styles.getPropertyValue(name).trim()
    return {
      theme,
      flare: read('--flare'),
      sand: read('--sand'),
      muted: read('--muted'),
      card: read('--card'),
      line: read('--line'),
    }
  }, [theme])
  const data = performance.map((item) => ({
    name: item.opponent.length > 12 ? `${item.opponent.slice(0, 11)}…` : item.opponent,
    won: item.clubSets,
    lost: item.opponentSets,
  }))

  if (data.length === 0) {
    return (
      <div className="grid h-72 place-items-center rounded-3xl border border-dashed border-line text-sm text-muted">
        Completed matches will appear on this chart.
      </div>
    )
  }

  return (
    <div className="h-80 w-full" role="img" aria-label="Bar chart of sets won and sets lost in completed matches">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <CartesianGrid stroke={colors.line} vertical={false} />
          <XAxis dataKey="name" stroke={colors.muted} tick={{ fill: colors.muted, fontSize: 12 }} interval={0} angle={-20} height={56} />
          <YAxis allowDecimals={false} stroke={colors.muted} tick={{ fill: colors.muted, fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: colors.line }}
            contentStyle={{ background: colors.card, color: colors.sand, border: `1px solid ${colors.line}`, borderRadius: 16 }}
          />
          <Legend wrapperStyle={{ color: colors.sand }} />
          <Bar dataKey="won" name="Sets won" fill={colors.flare} radius={[6, 6, 0, 0]} />
          <Bar dataKey="lost" name="Sets lost" fill={colors.sand} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
