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

  const chartData = []
  if (layerCounts.e2e > 0) {
    chartData.push({
      layer: 'e2e',
      count: layerCounts.e2e,
      fill: 'var(--color-e2e)',
    })
  }
  if (layerCounts.api > 0) {
    chartData.push({
      layer: 'api',
      count: layerCounts.api,
      fill: 'var(--color-api)',
    })
  }
  if (layerCounts.unit > 0) {
    chartData.push({
      layer: 'unit',
      count: layerCounts.unit,
      fill: 'var(--color-unit)',
    })
  }

  if (total === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-base">Testes por Camada</CardTitle>
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
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base">Testes por Camada</CardTitle>
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
              nameKey="layer"
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
            const config = chartConfig[item.layer as keyof typeof chartConfig]
            return (
              <div
                key={item.layer}
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
