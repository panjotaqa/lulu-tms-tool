import * as React from 'react'
import { Label, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TestRunCase } from '../types/testrun.types'

interface AutomationChartProps {
  testRunCases: TestRunCase[] | any[]
}

export function AutomationChart({ testRunCases }: AutomationChartProps) {
  const automationCounts = {
    manual: 0,
    automated: 0,
  }

  testRunCases.forEach((tc) => {
    const automationStatus = tc.testCaseSnapshot.automationStatus
    if (automationStatus === 'Automated' || automationStatus === 'automated') {
      automationCounts.automated++
    } else {
      automationCounts.manual++
    }
  })

  const total = testRunCases.length

  const chartData = []
  if (automationCounts.manual > 0) {
    chartData.push({
      type: 'manual',
      count: automationCounts.manual,
      fill: 'var(--color-manual)',
    })
  }
  if (automationCounts.automated > 0) {
    chartData.push({
      type: 'automated',
      count: automationCounts.automated,
      fill: 'var(--color-automated)',
    })
  }

  if (total === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-base">Manual vs Automatizado</CardTitle>
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
    manual: {
      label: 'Manual',
      color: 'hsl(217, 91%, 60%)',
    },
    automated: {
      label: 'Automated',
      color: 'hsl(142, 76%, 36%)',
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base">Manual vs Automatizado</CardTitle>
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
              nameKey="type"
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
            const config = chartConfig[item.type as keyof typeof chartConfig]
            return (
              <div
                key={item.type}
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
