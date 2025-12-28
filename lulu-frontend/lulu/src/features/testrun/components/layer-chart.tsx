import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { TestRunCase } from '../types/testrun.types'

interface LayerChartProps {
  testRunCases: TestRunCase[] | any[]
}

export function LayerChart({ testRunCases }: LayerChartProps) {
  const layerCounts = {
    e2e: 0,
    api: 0,
    unit: 0,
  }

  testRunCases.forEach((tc) => {
    const layer = tc.testCaseSnapshot.layer
    if (layer) {
      const layerUpper = layer.toUpperCase()
      if (layerUpper === 'E2E') {
        layerCounts.e2e++
      } else if (layerUpper === 'API') {
        layerCounts.api++
      } else if (layerUpper === 'UNIT') {
        layerCounts.unit++
      }
    }
  })

  const total = testRunCases.length

  const chartData = [
    {
      e2e: layerCounts.e2e,
      api: layerCounts.api,
      unit: layerCounts.unit,
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
    e2e: {
      label: 'E2E',
      color: 'hsl(217, 91%, 60%)',
    },
    api: {
      label: 'API',
      color: 'hsl(142, 76%, 36%)',
    },
    unit: {
      label: 'Unit',
      color: 'hsl(38, 92%, 50%)',
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
        {layerCounts.e2e > 0 && (
          <RadialBar
            dataKey="e2e"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-e2e)"
            className="stroke-transparent stroke-2"
          />
        )}
        {layerCounts.api > 0 && (
          <RadialBar
            dataKey="api"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-api)"
            className="stroke-transparent stroke-2"
          />
        )}
        {layerCounts.unit > 0 && (
          <RadialBar
            dataKey="unit"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-unit)"
            className="stroke-transparent stroke-2"
          />
        )}
      </RadialBarChart>
    </ChartContainer>
  )
}

