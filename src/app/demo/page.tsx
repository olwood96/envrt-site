"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";

const demoVideos = [
  {
    title: "Creating a Digital Product Passport",
    description: "See how quickly you can go from raw data to a published DPP.",
    thumbnail: "/mock/demo-dpp.png",
  },
  {
    title: "Sustainability metrics dashboard",
    description: "CO₂e and water scarcity metrics at a glance.",
    thumbnail: "/mock/demo-metrics.png",
  },
  {
    title: "Product page widget",
    description: "Embeddable sustainability widget for your online store.",
    thumbnail: "/mock/demo-widget.png",
  },
  {
    title: "Bulk collection upload",
    description: "Upload an entire collection and generate DPPs in bulk.",
    thumbnail: "/mock/demo-bulk.png",
  },
  {
    title: "Material comparison",
    description: "Compare environmental impact across different materials.",
    thumbnail: "/mock/demo-compare.png",
  },
  {
    title: "Brand dashboard overview",
    description: "A quick tour of the brand-facing analytics dashboard.",
    thumbnail: "/mock/demo-dashboard.png",
  },
];

function VideoCard({ title, description, thumbnail }: typeof demoVideos[0]) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-envrt-charcoal/5 bg-white transition-all duration-300 hover:border-envrt-teal/20 hover:shadow-lg hover:shadow-envrt-teal/5">
      <div className="relative aspect-video bg-gradient-to-br from-envrt-green/[0.03] to-envrt-teal/[0.06]">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 shadow-lg transition-transform group-hover:scale-110">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-1 text-envrt-green"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-envrt-charcoal">{title}</h3>
        <p className="mt-1 text-sm text-envrt-muted">{description}</p>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <div className="pt-28 pb-16">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-envrt-charcoal sm:text-5xl">
              See ENVRT in action
            </h1>
            <p className="mt-4 text-base text-envrt-muted sm:text-lg">
              Short walkthroughs of key features. No login required.
            </p>
          </div>
        </FadeUp>

        <StaggerChildren className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoVideos.map((video) => (
            <StaggerItem key={video.title}>
              <VideoCard {...video} />
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeUp delay={0.2}>
          <div className="mt-16 text-center">
            <p className="text-envrt-muted">
              Want a personalised walkthrough with your own product data?
            </p>
            <Button href="/contact" className="mt-4">
              Book a live demo →
            </Button>
          </div>
        </FadeUp>
      </Container>
    </div>
  );
}
