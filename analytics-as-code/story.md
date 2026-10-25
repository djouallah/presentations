# The story

## Before we start

I work for Microsoft. But this is not a Microsoft talk. It's a hobby project I have been
running on my own time since 2019, and everything I say here is my own opinion.

## It started with a solar farm

In 2019 I was working on a solar farm in Numurkah. During commissioning, my manager asked a
simple question: how much are we producing?

The data was public. AEMO publishes everything, every five minutes. He was happy with a
monthly figure, but I thought I could do better. I was just curious.

## Power BI

I'm a civil engineer, not a programmer. I used what I knew: Power BI and Power Query. It
worked. And because the data was public, I shared it as a public web page.

Then I hit the limits. The free version doesn't let people download the data, and the reality
is that export to Excel is the most important feature in any dashboard.

## The rabbit hole

So I went looking at what other people did. The smart people spun up a virtual machine and
wrote everything by hand. I didn't write code.

I learned anyway. Python, pandas, a cloud data warehouse, and a free BI service on top. I
asked a lot of questions on Stack Overflow. Most people were helpful. Not all of them. In
2019 I asked whether you could deploy a whole project using only code. Minus two. I asked
how to download the zip files from AEMO's site, the same job this project does every hour
today. Minus two. If you don't know the answer, you ask, and the question may well be
stupid. Getting downvoted for it is just not cool.

## Trying everything

Along the way I got curious about the engines themselves. Every warehouse and query engine
I could get my hands on, I tried. Then I started benchmarking them, and
blogging about it. Nobody asked me to; I just liked it.

That's how I found DuckDB: a small engine that kept up with the big ones on data my size.

Meanwhile the dashboard on the free BI service ran for about six years. Then the free tier I
depended on changed, and paying for a warehouse was too much risk for a hobby dashboard.

## Then AI

AI had been creeping in for a while. In 2025 I connected Claude to the database and asked
what it thought. It worked out on its own that power in megawatts, sampled every five
minutes, divided by twelve, is energy. That was the moment I knew things would not be the
same.

This year it became useful enough to change how I work. This version was written by AI from
its first day. Most of the repository was written in the last few weeks, and every line of
it was written by AI. Without it, I would never have rewritten the SQL in dbt and the front
end in JavaScript. dbt and Iceberg were the infrastructure; AI made it possible.

And it is too powerful. That's a good thing, and that's the problem.

On the second day of the project I added a test: the newest interval in the summary must be
the newest one that has both power and a price. Fifty minutes later the AI changed the
model and dropped the price. Then it changed the test to match the model, and called it a
correction. Green build. Wrong numbers.

## The browser does the work

With AI writing the code, I rebuilt everything on two open pieces: Iceberg, and DuckDB in
the browser. Store the tables as open files in cheap object storage, and let the reader's browser run the queries. No server, no
warehouse, nothing running while nobody is looking.

The backend is one dbt project, run every hour by GitHub Actions. A Python model downloads
AEMO's new files and archives them in object storage with a log. The landing tables keep the
facts as AEMO published them; the mart builds what the dashboard reads. Every table is
Iceberg, and every day 34 data tests run on the live tables. One rule I kept: the source
stays as raw as possible, and every transformation happens in the next layer.

Nothing in this setup belongs to a vendor. Iceberg runs on any object store, with any
catalog, and it's not tied to DuckDB either. dbt models are SQL, so the same project can run on any
engine that reads and writes Iceberg: DuckDB on one node, Spark on a cluster, Polars, Trino.
The engine is a choice, like the storage.

## Still not fully happy

It worked, but I wasn't fully happy. Every chart had its own SQL, and no single place said
what a number means. What if I want both? Enterprise BI, the tools people
already use at work, Power BI, Excel, behind a sign-in; and a proper semantic model, one
definition of every number, for the public page and the internal one. Fabric was an option,
but I couldn't afford a capacity for a hobby.

## Back to Power BI after 7 years

Then two new things happened in Fabric: apps, so the same page could run inside Fabric
behind a sign-in, as the internal tool; and pay-as-you-go, in August 2026. Fabric had been
there since 2023, and I wish I had had it in 2019. It's all fun until you use your own money. So I moved the tables to OneLake.

That move was one commit. The models barely changed, because the table format was Iceberg,
not a vendor's. That is the boring reason open formats matter.

So yes, I'm back to Power BI after seven years. But it's different. The core is the same,
but the storage is no longer tied to the engine, and the front end is written by AI too.
What really matters is the semantic model.

## Why not just write the SQL?

Every developer will ask: why do I need a semantic model? One chart, one query, what's the
problem? So write it: generation, demand and price by region for one day, units joined to
the regional table on region and interval. It looks right, runs fast, passes review.

For New South Wales on 12 October 2026, generation is right. Demand is 68 times too much,
because each region row comes back once for every generator running. That one you'd
catch. The price you wouldn't: $763 instead of $648. That afternoon the price spiked to
$23,107 with 86 generators running; at night there are about 54. The join counts the spike
86 times and a night interval 54 times. Believable, and wrong. That's fan-out, and the fix
is old: aggregate each table first, then join.

The semantic model does that for you. Average generation and share by fuel, two measures,
reads four tables at three grains, each aggregated first and joined on the fuel. One KPI
tile, the change against the period before, is 141 characters of DAX and 98 SELECTs of SQL.
Nobody writes that by hand for every chart, and nobody reviews it. I review the measure.

## One number, many definitions

The dashboard was doing arithmetic everywhere. Summing stations, subtracting for changes,
carrying prices forward. Every chart was right on its own, so every check passed. What was
lost was one definition of each number. A second version of the page, with its SQL written
chart by chart, disagreed with the first on 84 questions out of 683.

And if you ask an AI for generation by fuel, it gives you SQL fast and confidently. It
counts a charging battery as negative generation. On a sunny afternoon in New South Wales
that's off by hundreds of megawatts. I'll show you in a minute.

The obvious fix is to give the AI the semantic model and let it write the SQL. I'm not
convinced. It knows the definitions, but it still has to get every join, every grain and
every fan-out right again, on every question. Most of the time it will; most of the time is
the problem. The model as context is a hint, not a guarantee. Reading the model isn't the
same as obeying it.

## The semantic model is the harness

So the AI doesn't write the SQL any more. It names the measure.

The semantic model is one text file. It says what generation means, which fuels are
renewable, which units are batteries. Power BI runs it. The same file runs in your browser,
compiled to SQL for DuckDB. A chart can only pick fields, filters and measures. No
arithmetic, no SQL.

The business knowledge lives in the model, not in the AI. And because it's text, I don't
review 683 queries. I review one file.

## Less is more

Every check in this repo exists because something went wrong first. On every push, a lint
fails the build if the page does any arithmetic, and every model and test is built on real
AEMO files. Every day, 34 tests run on the live tables: one row per key, every file loaded,
the feeds fresh.

Your users won't write these. In a sense, the traditional dashboard was better: it's a
limited surface. You pick fields, filters and measures, and you can't invent a new
definition of a number. Free SQL, for a user or for an AI, is a new definition every time.
Less is more.

## What I think comes next

Storage is already decoupled from compute. The semantic model will be decoupled from compute
too, from the BI tool and from the warehouse. There is already an open format for it, Apache
Ossie, backed by Snowflake, Databricks, Google and Microsoft; the semantic model in this repo
is an Ossie file. The technology matters less and less. The primitives matter, cost and
performance matter, and AI will do the rest.

And there will be many front ends. I don't think the GUI is going away, not in the medium
term. This repo already has several on the same semantic model: a Power BI report, a web
page written by AI, the same page as a Fabric app, the same page asking in SQL, and an SQL
box where you or an AI can ask anything. And the same page again, with Power BI's own engine
answering its queries. Different front ends, one definition of every number.

In 2019 Power BI was a business tool you clicked in. Today it's a semantic model in a text
file, over open tables, and its engine can sit behind a front end an AI wrote. I came back
to Power BI, but not to the same Power BI.

But you still need to understand the tests. And you still need to know the business and
what your users actually want, which is not obvious at all.

## The end

If I had had AI in 2019, I probably wouldn't be giving this talk.

Nobody asked me to build any of this. I was just curious, and I loved figuring it out. Now
AI does it in a minute. It's a bit sad, but it is what it is.

Sometimes the journey matters more than the destination. At least for a human.
