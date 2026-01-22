import { StatusChart } from './status-chart'
import { AutomationChart } from './automation-chart'
import { LayerChart } from './layer-chart'
import type { TestRunCase } from '../types/testrun.types'

interface TestRunStatsPanelProps {
  testRunCases: TestRunCase[] | any[]
}

export function TestRunStatsPanel({ testRunCases }: TestRunStatsPanelProps) {
  return (
    <div className="space-y-6">
      <StatusChart testRunCases={testRunCases} />
      <AutomationChart testRunCases={testRunCases} />
      <LayerChart testRunCases={testRunCases} />
    </div>
  )
}

