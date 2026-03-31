import * as React from 'react'
import { Label, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

  const chartData = []
  if (statusCounts[TestRunCaseStatus.PASSED] > 0) {
    chartData.push({
      status: 'passed',
      count: statusCounts[TestRunCaseStatus.PASSED],
      fill: 'var(--color-passed)',
    })
  }
  if (statusCounts[TestRunCaseStatus.FAILED] > 0) {
    chartData.push({
      status: 'failed',
      count: statusCounts[TestRunCaseStatus.FAILED],
      fill: 'var(--color-failed)',
    })
  }
  if (statusCounts[TestRunCaseStatus.BLOCKED] > 0) {
    chartData.push({
      status: 'blocked',
      count: statusCounts[TestRunCaseStatus.BLOCKED],
      fill: 'var(--color-blocked)',
    })
  }
  if (statusCounts[TestRunCaseStatus.PENDING] > 0) {
    chartData.push({
      status: 'pending',
      count: statusCounts[TestRunCaseStatus.PENDING],
      fill: 'var(--color-pending)',
    })
  }
  if (statusCounts[TestRunCaseStatus.SKIPPED] > 0) {
    chartData.push({
      status: 'skipped',
      count: statusCounts[TestRunCaseStatus.SKIPPED],
      fill: 'var(--color-skipped)',
    })
  }

  if (total === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-base">Status de Execução</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
            Nenhum dado disponível
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartConfig = {
    count: {
      label: 'Count',
    },
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
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base">Status de Execução</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="pt-0">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {chartData.map((item) => {
            const config = chartConfig[item.status as keyof typeof chartConfig]
            return (
              <div
                key={item.status}
                className="flex items-center gap-1.5 text-sm"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-muted-foreground">{config.label}</span>
                <span className="font-medium">{item.count}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
