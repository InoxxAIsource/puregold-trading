import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TESTIMONIALS = [
  { id: 1, name: "Robert M.", state: "TX", rating: 5, date: "Oct 12, 2023", text: "Exceptional service and the lowest premiums I've found on Gold Eagles. Packaging was discreet and secure." },
  { id: 2, name: "Sarah J.", state: "FL", rating: 5, date: "Sep 28, 2023", text: "My first time buying physical silver. The process was incredibly smooth and the bars arrived in perfect condition." },
  { id: 3, name: "David L.", state: "CA", rating: 5, date: "Nov 05, 2023", text: "Moved part of my IRA here. Their team handled everything professionally. Highly recommend GoldBuller." },
  { id: 4, name: "Michael P.", state: "NY", rating: 5, date: "Aug 14, 2023", text: "Fast shipping, competitive prices, and their customer service answers the phone quickly. Will buy again." },
  { id: 5, name: "Jennifer W.", state: "OH", rating: 5, date: "Dec 02, 2023", text: "The quality of the cast gold bars is stunning. Arrived exactly as described with assay certificates." },
];

export function TestimonialsCarousel() {
  return (
    <div className="w-full relative px-12 py-8 bg-card border-y border-border" data-testid="testimonials-carousel">
      <div className="container mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-10 text-foreground">What Our Customers Say</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {TESTIMONIALS.map((t) => (
              <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="bg-background border-border/50 h-full">
                    <CardContent className="flex flex-col p-6 h-full">
                      <div className="flex text-primary mb-4">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-muted-foreground text-sm italic mb-6 flex-grow">"{t.text}"</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                        <div>
                          <p className="text-sm font-bold text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.state}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Verified
                          </p>
                          <p className="text-xs text-muted-foreground">{t.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
