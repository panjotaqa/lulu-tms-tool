import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { TestRunCaseStatus } from '../types/testrun.types'
import type { TestRunCase } from '../types/testrun.types'

interface StatusChartProps {
  testRunCases: TestRunCase[] | any[]
}

export function StatusChart({ testRunCases }: StatusChartProps) {
  const statusCounts = {
    [TestRunCaseStatus.PASSED]: 0,
    [TestRunCaseStatus.FAILED]: 0,
    [TestRunCaseStatus.BLOCKED]: 0,
    [TestRunCaseStatus.PENDING]: 0,
    [TestRunCaseStatus.SKIPPED]: 0,
  }

  testRunCases.forEach((tc) => {
    statusCounts[tc.status] = (statusCounts[tc.status] || 0) + 1
  })

  const total = testRunCases.length

  const chartData = [
    {
      passed: statusCounts[TestRunCaseStatus.PASSED],
      failed: statusCounts[TestRunCaseStatus.FAILED],
      blocked: statusCounts[TestRunCaseStatus.BLOCKED],
      pending: statusCounts[TestRunCaseStatus.PENDING],
      skipped: statusCounts[TestRunCaseStatus.SKIPPED],
    },
  ]

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
        Nenhum dado disponível
      </div>
    )
  }

  const chartConfig = {
    passed: {
      label: 'Passed',
      color: 'hsl(142, 76%, 36%)',
    },
    failed: {
      label: 'Failed',
      color: 'hsl(0, 84%, 60%)',
    },
    blocked: {
      label: 'Blocked',
      color: 'hsl(38, 92%, 50%)',
    },
    pending: {
      label: 'Pending',
      color: 'hsl(215, 16%, 47%)',
    },
    skipped: {
      label: 'Skipped',
      color: 'hsl(25, 95%, 53%)',
    },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[200px]"
    >
      <RadialBarChart
        data={chartData}
        endAngle={180}
        innerRadius={60}
        outerRadius={100}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {total.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground text-sm"
                    >
                      Total
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
        {statusCounts[TestRunCaseStatus.PASSED] > 0 && (
          <RadialBar
            dataKey="passed"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-passed)"
            className="stroke-transparent stroke-2"
          />
        )}
        {statusCounts[TestRunCaseStatus.FAILED] > 0 && (
          <RadialBar
            dataKey="failed"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-failed)"
            className="stroke-transparent stroke-2"
          />
        )}
        {statusCounts[TestRunCaseStatus.BLOCKED] > 0 && (
          <RadialBar
            dataKey="blocked"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-blocked)"
            className="stroke-transparent stroke-2"
          />
        )}
        {statusCounts[TestRunCaseStatus.PENDING] > 0 && (
          <RadialBar
            dataKey="pending"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-pending)"
            className="stroke-transparent stroke-2"
          />
        )}
        {statusCounts[TestRunCaseStatus.SKIPPED] > 0 && (
          <RadialBar
            dataKey="skipped"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-skipped)"
            className="stroke-transparent stroke-2"
          />
        )}
      </RadialBarChart>
    </ChartContainer>
  )
}

