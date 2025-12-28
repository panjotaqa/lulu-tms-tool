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
      <div>
        <h3 className="text-lg font-semibold mb-2">Status de Execução</h3>
        <StatusChart testRunCases={testRunCases} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Manual vs Automatizado</h3>
        <AutomationChart testRunCases={testRunCases} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Testes por Camada</h3>
        <LayerChart testRunCases={testRunCases} />
      </div>
    </div>
  )
}

