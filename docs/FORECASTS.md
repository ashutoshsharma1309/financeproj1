# Forecasts

Model how your finances could evolve from the Forecasts module (`/forecasts`).

## Creating a scenario

Click **New forecast** and set:

- **Name** — e.g. "Base case" or "Aggressive growth"
- **Horizon** — months to project (1–36)
- **Starting cash** — defaults to your current cash position
- **Monthly revenue growth (%)**
- **Monthly expense growth (%)**

## Baseline

Projections start from your recent revenue and expense averages, then apply the
growth assumptions each month (`projectForecast`). Add some real data first for
meaningful output.

## Output

A chart plots projected **revenue**, **expense** and **cash** over the horizon,
with cards for starting cash, projected end cash and the horizon length.

## Comparing scenarios

Save multiple forecasts and switch between them in the left list to compare
outcomes.
