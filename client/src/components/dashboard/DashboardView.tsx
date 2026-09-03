"use client";

import { Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardGrid, GridItem } from "@/components/layout/DashboardGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { AiAssistantDock } from "@/components/ai/AiAssistantDock";
import { AiInsightCard } from "@/components/ai/AiInsightCard";
import { DigestFeed } from "@/components/ai/DigestFeed";
import { PredictionPanel } from "@/components/ai/PredictionPanel";
import { SentimentGauge } from "@/components/ai/SentimentGauge";
import { SuggestionList } from "@/components/ai/SuggestionList";
import { MarketHeatmap } from "@/components/market/MarketHeatmap";
import { MarketMoversPanel } from "@/components/market/MarketMoversPanel";
import { PriceChartPanel } from "@/components/market/PriceChartPanel";
import { TickerTape } from "@/components/market/TickerTape";
import { WatchlistPanel } from "@/components/market/WatchlistPanel";
import { AlertsPanel } from "@/components/widgets/AlertsPanel";
import { NewsFeedPanel } from "@/components/widgets/NewsFeedPanel";
import { PortfolioSummaryCard } from "@/components/widgets/PortfolioSummaryCard";
import { StatTileRow } from "@/components/widgets/StatTileRow";
import { placeholder } from "@/components/dashboard/placeholder-data";

/**
 * Dashboard composition — the reference arrangement of every component shell.
 *
 * TODO(UI): every panel below is currently fed from `placeholder`. Replace each
 * prop source with the corresponding LOGIC hook once it exists, then delete
 * `placeholder-data.ts`. No fetching, caching, or derivation belongs in here.
 */
export function DashboardView() {
  return (
    <>
      <TickerTape entries={placeholder.tape} />

      <PageHeader
        title="Market overview"
        subtitle="Live prices, model projections, and the AI digest for everything you follow."
        actions={
          <>
            <Button variant="outline" size="md">
              <Download aria-hidden />
              Export
            </Button>
            <Button variant="primary" size="md">
              <Sparkles aria-hidden />
              Run analysis
            </Button>
          </>
        }
      />

      <StatTileRow tiles={placeholder.stats} />

      <AiAssistantDock />

      <DashboardGrid>
        <GridItem $span={8}>
          <PriceChartPanel
            ticker={placeholder.focus.ticker}
            quote={placeholder.focus.quote}
            series={placeholder.focus.series}
            display={placeholder.focus.display}
          />
        </GridItem>
        <GridItem $span={4}>
          <WatchlistPanel rows={placeholder.watchlist} />
        </GridItem>

        <GridItem $span={4}>
          <PredictionPanel entries={placeholder.predictions} />
        </GridItem>
        <GridItem $span={4}>
          <AiInsightCard insight={placeholder.insight.insight} display={placeholder.insight.display} />
        </GridItem>
        <GridItem $span={4}>
          <SentimentGauge
            reading={placeholder.sentiment.reading}
            display={placeholder.sentiment.display}
          />
        </GridItem>

        <GridItem $span={4}>
          <MarketMoversPanel entries={placeholder.movers} />
        </GridItem>
        <GridItem $span={4}>
          <SuggestionList entries={placeholder.suggestions} />
        </GridItem>
        <GridItem $span={4}>
          <PortfolioSummaryCard
            summary={placeholder.portfolio.summary}
            display={placeholder.portfolio.display}
          />
        </GridItem>

        <GridItem $span={8}>
          <MarketHeatmap cells={placeholder.heatmap.cells} labels={placeholder.heatmap.labels} />
        </GridItem>
        <GridItem $span={4}>
          <AlertsPanel alerts={placeholder.alerts.alerts} timestamps={placeholder.alerts.timestamps} />
        </GridItem>

        <GridItem $span={6}>
          <DigestFeed entries={placeholder.digest.entries} timestamps={placeholder.digest.timestamps} />
        </GridItem>
        <GridItem $span={6}>
          <NewsFeedPanel items={placeholder.news.items} timestamps={placeholder.news.timestamps} />
        </GridItem>
      </DashboardGrid>
    </>
  );
}
