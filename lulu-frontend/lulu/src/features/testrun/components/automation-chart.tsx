import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
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

  const chartData = [
    {
      manual: automationCounts.manual,
      automated: automationCounts.automated,
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
        {automationCounts.manual > 0 && (
          <RadialBar
            dataKey="manual"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-manual)"
            className="stroke-transparent stroke-2"
          />
        )}
        {automationCounts.automated > 0 && (
          <RadialBar
            dataKey="automated"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-automated)"
            className="stroke-transparent stroke-2"
          />
        )}
      </RadialBarChart>
    </ChartContainer>
  )
}

